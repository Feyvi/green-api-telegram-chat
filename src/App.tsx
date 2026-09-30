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
      <header className="header">
        <h1>Telegram Chat</h1>
        {isConnected && <button onClick={connection.logout}>Выйти</button>}
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
