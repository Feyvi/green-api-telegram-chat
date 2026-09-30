import { type FormEvent, useState } from "react";

type ChatSetupProps = {
  onChatCreate: (phoneNumber: string) => void;
  isLoading: boolean;
};

export function ChatSetup({ onChatCreate, isLoading }: ChatSetupProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = phoneNumber.replace(/\D/g, "");
    if (!normalizedPhone) {
      setError("Введите номер телефона");
      return;
    }
    if (normalizedPhone.length < 10) {
      setError("Введите корректный номер телефона");
      return;
    }
    setError("");
    onChatCreate(normalizedPhone);
  };

  return (
    <form className="chat-setup" onSubmit={handleSubmit}>
      <h2>Новый чат</h2>
      <label>
        Номер телефона
        <input
          type="text"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="79991234567"
          required
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Создание..." : "Создать чат"}
      </button>
    </form>
  );
}
