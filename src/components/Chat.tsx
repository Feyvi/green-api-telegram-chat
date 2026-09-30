import { type FormEvent, useEffect, useRef, useState } from "react";
import type { Message } from "../types";
import styles from "../styles/Chat.module.css";

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) {
      return;
    }
    const sent = await onSendMessage(text);
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
    <section className={styles.chat}>
      <div className={styles.header}>
        <div className={styles.user}>
          <div className={styles.avatar}>T</div>
          <div>
            <h2>Telegram</h2>
            <p>{phoneNumber}</p>
          </div>
        </div>
        <button className={styles.changeButton} onClick={onChangeChat}>
          Новый чат
        </button>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <p>Сообщений пока нет</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.direction === "outgoing" ? styles.outgoing : styles.incoming
              }`}
            >
              <span className={styles.text}>{msg.text}</span>
              <span className={styles.time}>{formatTime(msg.timestamp)}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.messageForm} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Сообщение..."
          disabled={isLoading}
        />
        <button
          className={styles.sendButton}
          type="submit"
          disabled={isLoading || !message.trim()}
          title="Отправить сообщение"
        >
          <svg
            className={styles.sendIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </section>
  );
}
