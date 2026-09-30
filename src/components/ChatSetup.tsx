import { type FormEvent, useState } from "react";

import styles from "../styles/ChatSetup.module.css";

type ChatSetupProps = {
  onChatCreate: (phoneNumber: string) => void;
  isLoading: boolean;
  error: string;
};

export function ChatSetup({ onChatCreate, isLoading, error }: ChatSetupProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = phoneNumber.replace(/\D/g, "");
    if (!normalizedPhone) {
      setValidationError("Введите номер телефона");
      return;
    }
    if (normalizedPhone.length < 10) {
      setValidationError("Введите корректный номер телефона");
      return;
    }
    setValidationError("");
    onChatCreate(normalizedPhone);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Новый чат</h2>
        <label className={styles.label}>
          Номер телефона
          <input
            className={styles.input}
            type="text"
            value={phoneNumber}
            onChange={(event) => {
              setPhoneNumber(event.target.value);
              setValidationError("");
            }}
            placeholder="79991234567"
            required
          />
        </label>
        {validationError && <p className={styles.error}>{validationError}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Создание..." : "Создать чат"}
        </button>
      </form>
    </div>
  );
}
