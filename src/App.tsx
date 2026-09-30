import { useEffect, useState } from 'react';
import {ConnectionForm} from './components/ConnectionForm';
import {ChatSetup} from './components/ChatSetup';
import {Chat} from './components/Chat';
import {
  checkAccount,
  deleteNotification,
  getStateInstance,
  receiveNotification,
  sendMessage,
} from './services/greenApi';
import type {
  GreenApiCredentials,
  Message,
} from './types';

function App() {
  const [credentials, setCredentials] =
    useState<GreenApiCredentials | null>(null);

  const [chatId, setChatId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] =
    useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [messageLoading, setMessageLoading] =
    useState(false);

  const [error, setError] = useState('');
  const [chatError, setChatError] = useState('');
  const [messageError, setMessageError] =
    useState('');
  const [receivingError, setReceivingError] =
    useState('');

  const isConnected = credentials !== null;

  const handleConnect = async (
    newCredentials: GreenApiCredentials
  ) => {
    setError('');
    setIsLoading(true);

    try {
      const result =
        await getStateInstance(newCredentials);

      if (result.stateInstance === 'authorized') {
        setCredentials(newCredentials);
        return;
      }

      setError('Инстанс не авторизован');
    } catch {
      setError(
        'Не удалось подключиться к GREEN-API'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatCreate = async (
    newPhoneNumber: string
  ) => {
    if (!credentials) {
      return;
    }

    setChatError('');
    setChatLoading(true);

    try {
      const result = await checkAccount(
        credentials,
        newPhoneNumber
      );

      if (!result.exist) {
        setChatError(
          'Telegram-аккаунт по этому номеру не найден'
        );
        return;
      }

      setChatId(result.chatId);
      setPhoneNumber(newPhoneNumber);
      setMessages([]);
    } catch {
      setChatError(
        'Не удалось проверить номер телефона'
      );
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (
    message: string
  ): Promise<boolean> => {
    if (!credentials || !chatId) {
      return false;
    }

    setMessageError('');
    setMessageLoading(true);

    try {
      const result = await sendMessage(
        credentials,
        chatId,
        message
      );

      const newMessage: Message = {
        id: result.idMessage,
        text: message,
        direction: 'outgoing',
        timestamp: new Date().toISOString(),
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        newMessage,
      ]);

      return true;
    } catch {
      setMessageError(
        'Не удалось отправить сообщение'
      );

      return false;
    } finally {
      setMessageLoading(false);
    }
  };

  const handleChangeChat = () => {
    setChatId(null);
    setPhoneNumber(null);
    setMessages([]);
    setChatError('');
    setMessageError('');
  };

  const handleLogout = () => {
    setCredentials(null);
    setChatId(null);
    setPhoneNumber(null);
    setMessages([]);

    setError('');
    setChatError('');
    setMessageError('');
    setReceivingError('');
  };

  useEffect(() => {
    if (!credentials || !chatId) {
      return;
    }

    let isLive = true;

    const receiveMessages = async () => {
      if (!isLive) {
        return;
      }

      try {
        const notification =
          await receiveNotification(credentials);

        if (notification) {
          const { body } = notification;

          if (
            body.typeWebhook ===
              'incomingMessageReceived' &&
            body.senderData.chatId === chatId &&
            body.messageData.typeMessage ===
              'textMessage'
          ) {
            const textMessage =
              body.messageData.textMessageData
                ?.textMessage;

            if (textMessage) {
              const newMessage: Message = {
                id: body.idMessage,
                text: textMessage,
                direction: 'incoming',
                timestamp: new Date(
                  body.timestamp * 1000
                ).toISOString(),
              };

              setMessages((currentMessages) => {
                const messageExists =
                  currentMessages.some(
                    (message) =>
                      message.id === newMessage.id
                  );

                if (messageExists) {
                  return currentMessages;
                }

                return [
                  ...currentMessages,
                  newMessage,
                ];
              });
            }

            await deleteNotification(
              credentials,
              notification.receiptId
            );
          } else {
            await deleteNotification(
              credentials,
              notification.receiptId
            );
          }
        }

        setReceivingError('');
      } catch (error) {
        console.error(
          'Ошибка получения сообщения:',
          error
        );

        setReceivingError(
          'Не удалось получить новые сообщения'
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );
      }

      if (isLive) {
        receiveMessages();
      }
    };

    receiveMessages();

    return () => {
      isLive = false;
    };
  }, [credentials, chatId]);

  return (
    <div className="app">
      <header className="header">
        <h1>Telegram Chat</h1>

        {isConnected && (
          <button onClick={handleLogout}>
            Выйти
          </button>
        )}
      </header>

      <main className="main">
        {!isConnected ? (
          <>
            <ConnectionForm
              onConnect={handleConnect}
              isLoading={isLoading}
            />

            {error && (
              <p className="error">
                {error}
              </p>
            )}
          </>
        ) : !chatId ? (
          <>
            <ChatSetup
              onChatCreate={handleChatCreate}
              isLoading={chatLoading}
            />

            {chatError && (
              <p className="error">
                {chatError}
              </p>
            )}
          </>
        ) : (
          <Chat
            phoneNumber={phoneNumber ?? ''}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={messageLoading}
            onChangeChat={handleChangeChat}
            error={
              messageError || receivingError
            }
          />
        )}
      </main>
    </div>
  );
}

export default App;