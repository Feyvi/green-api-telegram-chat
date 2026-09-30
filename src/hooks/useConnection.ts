import { useState } from "react";
import { getStateInstance } from "../services/greenApi";
import type { GreenApiCredentials } from "../types";

export function useConnection() {
  const [credentials, setCredentials] = useState<GreenApiCredentials | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const connect = async (newCredentials: GreenApiCredentials) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await getStateInstance(newCredentials);
      if (result.stateInstance === "authorized") {
        setCredentials(newCredentials);
        return;
      }
      setError("Инстанс не авторизован");
    } catch {
      setError("Не удалось подключиться к GREEN-API");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCredentials(null);
    setError("");
  };

  return {
    credentials,
    isLoading,
    error,
    connect,
    logout,
  };
}
