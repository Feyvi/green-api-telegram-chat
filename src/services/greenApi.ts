import type {
  DeleteNotificationResponse,
  GreenApiAccount,
  GreenApiCredentials,
  GreenApiNotification,
  GreenApiState,
  SendMessageResponse,
} from "../types";

const API_URL = "https://api.green-api.com";

export const getStateInstance = async (
  credentials: GreenApiCredentials,
): Promise<GreenApiState> => {
  const { idInstance, apiTokenInstance } = credentials;
  const response = await fetch(
    `${API_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
  );
  if (!response.ok) {
    throw new Error("Не удалось получить состояние инстанса");
  }
  return response.json();
};

export const checkAccount = async (
  credentials: GreenApiCredentials,
  phoneNumber: string,
): Promise<GreenApiAccount> => {
  const { idInstance, apiTokenInstance } = credentials;
  const response = await fetch(
    `${API_URL}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: Number(phoneNumber) }),
    },
  );
  if (!response.ok) {
    throw new Error("Не удалось проверить номер телефона");
  }
  return response.json();
};

export const sendMessage = async (
  credentials: GreenApiCredentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> => {
  const { idInstance, apiTokenInstance } = credentials;
  const response = await fetch(
    `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    },
  );
  if (!response.ok) {
    throw new Error("Не удалось отправить сообщение");
  }
  return response.json();
};

export const receiveNotification = async (
  credentials: GreenApiCredentials,
): Promise<GreenApiNotification | null> => {
  const { idInstance, apiTokenInstance } = credentials;
  const response = await fetch(
    `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=15`,
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Не удалось получить уведомление: ${response.status} ${errorText}`,
    );
  }
  const text = await response.text();
  if (!text) {
    return null;
  }
  return JSON.parse(text);
};

export const deleteNotification = async (
  credentials: GreenApiCredentials,
  receiptId: number,
): Promise<DeleteNotificationResponse> => {
  const { idInstance, apiTokenInstance } = credentials;
  const response = await fetch(
    `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("Не удалось удалить уведомление");
  }
  return response.json();
};
