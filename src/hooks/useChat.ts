import { useEffect, useState } from "react";

import {
  checkAccount,
  deleteNotification,
  receiveNotification,
  sendMessage,
} from "../services/greenApi";

import type { GreenApiCredentials, Message } from "../types";

export function useChat(credentials: GreenApiCredentials | null) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [receivingError, setReceivingError] = useState("");

  const createChat = async (newPhoneNumber: string) => {
    if (!credentials) {
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const result = await checkAccount(credentials, newPhoneNumber);
      if (!result.exist) {
        setError("Telegram-аккаунт по этому номеру не найден");
        return;
      }
      setChatId(result.chatId);
      setPhoneNumber(newPhoneNumber);
      setMessages([]);
    } catch {
      setError("Не удалось проверить номер телефона");
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async (message: string): Promise<boolean> => {
    if (!credentials || !chatId) {
      return false;
    }
    setMessageError("");
    setMessageLoading(true);
    try {
      const result = await sendMessage(credentials, chatId, message);
      const newMessage: Message = {
        id: result.idMessage,
        text: message,
        direction: "outgoing",
        timestamp: new Date().toISOString(),
      };
      setMessages((currentMessages) => [...currentMessages, newMessage]);
      return true;
    } catch {
      setMessageError("Не удалось отправить сообщение");
      return false;
    } finally {
      setMessageLoading(false);
    }
  };

  const changeChat = () => {
    setChatId(null);
    setPhoneNumber(null);
    setMessages([]);
    setError("");
    setMessageError("");
  };

  useEffect(() => {
    if (!credentials || !chatId) {
      return;
    }
    let isLive = true;
    const receiveMessages = async () => {
      while (isLive) {
        try {
          const notification = await receiveNotification(credentials);
          if (!isLive) {
            return;
          }
          if (notification) {
            const { body } = notification;
            if (
              body.typeWebhook === "incomingMessageReceived" &&
              body.senderData.chatId === chatId &&
              body.messageData.typeMessage === "textMessage"
            ) {
              const textMessage = body.messageData.textMessageData?.textMessage;
              if (textMessage) {
                const newMessage: Message = {
                  id: body.idMessage,
                  text: textMessage,
                  direction: "incoming",
                  timestamp: new Date(body.timestamp * 1000).toISOString(),
                };
                setMessages((currentMessages) => {
                  const messageExists = currentMessages.some(
                    (message) => message.id === newMessage.id,
                  );
                  if (messageExists) {
                    return currentMessages;
                  }
                  return [...currentMessages, newMessage];
                });
              }
            }

            await deleteNotification(credentials, notification.receiptId);
          }
          setReceivingError("");
        } catch (error) {
          console.error("Ошибка получения сообщения:", error);
          if (!isLive) {
            return;
          }
          setReceivingError("Не удалось получить новые сообщения");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    receiveMessages();
    return () => {
      isLive = false;
    };
  }, [credentials, chatId]);

  useEffect(() => {
    if (credentials) {
      return;
    }
    setChatId(null);
    setPhoneNumber(null);
    setMessages([]);
    setError("");
    setMessageError("");
    setReceivingError("");
  }, [credentials]);

  return {
    chatId,
    phoneNumber,
    messages,
    isLoading,
    messageLoading,
    error,
    messageError,
    receivingError,
    createChat,
    sendChatMessage,
    changeChat,
  };
}
