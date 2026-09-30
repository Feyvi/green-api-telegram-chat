import { type FormEvent, useState } from "react";

import type { GreenApiCredentials } from "../types";
import styles from '../styles/ConnectionForm.module.css';

type ConnectionFormProps = {
  onConnect: (credentials: GreenApiCredentials) => void;
  isLoading: boolean;
  error: string;
};

export function ConnectionForm({ onConnect, isLoading, error }: ConnectionFormProps) {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConnect({
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Подключение</h2>
        <label className={styles.label}>
          ID инстанса
          <input
            className={styles.input}
            type="text"
            value={idInstance}
            onChange={(event) => setIdInstance(event.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          API Token
          <input
            className={styles.input}
            type="password"
            value={apiTokenInstance}
            onChange={(event) => setApiTokenInstance(event.target.value)}
            required
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Подключение..." : "Подключиться"}
        </button>
      </form>
    </div>
  );
}

