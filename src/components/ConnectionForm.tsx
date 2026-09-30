import { useState, type FormEvent } from "react";
import type { GreenApiCredentials } from "../types";

type ConnectionFormProps = {
  onConnect: (credentials: GreenApiCredentials) => void;
  isLoading: boolean;
};

export function ConnectionForm({ onConnect, isLoading }: ConnectionFormProps) {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConnect({
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
  };

  return (
    <form className="connection" onSubmit={handleSubmit}>
      <h2>Подключение</h2>
      <label>
        ID инстанса
        <input
          type="text"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          required
        />
      </label>
      <label>
        API токен
        <input
          type="password"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Подключение..." : "Подключиться"}
      </button>
    </form>
  );
}
