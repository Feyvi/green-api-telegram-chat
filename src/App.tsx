import { ConnectionForm } from "./components/ConnectionForm";
import { ChatSetup } from "./components/ChatSetup";
import { Chat } from "./components/Chat";
import { useConnection } from "./hooks/useConnection";
import { useChat } from "./hooks/useChat";

function App() {
  const connection = useConnection();
  const chat = useChat(connection.credentials);
  const isConnected = connection.credentials !== null;
  return (
    <div className="app">
      <header className={`header ${!isConnected ? "header--start" : ""}`}>
        <div className="telegram-logo">
          <svg viewBox="0 0 240 240" aria-label="Telegram" role="img">
            <circle cx="120" cy="120" r="120" fill="#3390ec" />

            <path
              d="M55 118.5 172.4 73.1c5.4-2 10.5 1.3 8.7 8.1l-20 94.1c-1.5 6.7-5.5 8.3-11.2 5.2l-30.8-22.7-14.9 14.4c-1.7 1.7-3.1 3.1-6.3 3.1l2.2-31.4 57.2-51.7c2.5-2.2-.5-3.4-3.9-1.2l-70.7 44.5-30.5-9.5c-6.6-2.1-6.7-6.6 1.4-9.4Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        {isConnected && (
          <button className="logout-button" onClick={connection.logout}>
            Выйти
          </button>
        )}
      </header>
      <main className="main">
        {!isConnected ? (
          <ConnectionForm
            onConnect={connection.connect}
            isLoading={connection.isLoading}
            error={connection.error}
          />
        ) : !chat.chatId ? (
          <ChatSetup
            onChatCreate={chat.createChat}
            isLoading={chat.isLoading}
            error={chat.error}
          />
        ) : (
          <Chat
            phoneNumber={chat.phoneNumber ?? ""}
            messages={chat.messages}
            onSendMessage={chat.sendChatMessage}
            isLoading={chat.messageLoading}
            onChangeChat={chat.changeChat}
            error={chat.messageError || chat.receivingError}
          />
        )}
      </main>
    </div>
  );
}

export default App;
