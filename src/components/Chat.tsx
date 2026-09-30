import { type FormEvent, useEffect, useRef, useState } from "react";
import type { Message } from "../types";
import styles from '../styles/Chat.module.css';

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
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.direction === "outgoing"
                  ? styles.outgoing
                  : styles.incoming
              }`}
            >
              <span className={styles.text}>{message.text}</span>
              <span className={styles.time}>
                {formatTime(message.timestamp)}
              </span>
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
          placeholder="Напишите сообщение..."
          disabled={isLoading}
        />
        <button
          className={styles.sendButton}
          type="submit"
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? "..." : "Отправить"}
        </button>
      </form>
    </section>
  );
}
