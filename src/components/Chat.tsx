import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Message } from "../types";

type ChatProps = {
  phoneNumber: string;
  messages: Message[];
  onSendMessage: (message: string) => Promise<boolean>;
  isLoading: boolean;
  onChangeChat: () => void;
  error: string;
};

export function Chat({
  phoneNumber,
  messages,
  onSendMessage,
  isLoading,
  onChangeChat,
  error,
}: ChatProps) {
  const [message, setMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }
    const sent = await onSendMessage(message);
    if (sent) {
      setMessage("");
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="chat">
      <div className="chat-header">
        <div className="chat-user">
          <div className="avatar">T</div>
          <div>
            <h2>Telegram</h2>
            <p>{phoneNumber}</p>
          </div>
        </div>
        <button className="change-chat-button" onClick={onChangeChat}>
          Новый чат
        </button>
      </div>
      <div className="messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>Сообщений пока нет</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.direction}`}>
              <span className="message-text">{message.text}</span>

              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
            </div>
          ))
        )}
        <div ref={messagesRef} />
      </div>
      {error && <p className="chat-error">{error}</p>}
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Напишите сообщение..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !message.trim()}>
          {isLoading ? "..." : "Отправить"}
        </button>
      </form>
    </section>
  );
}
