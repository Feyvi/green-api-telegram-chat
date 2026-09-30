export type GreenApiCredentials = {
  idInstance: string;
  apiTokenInstance: string;
};

export type GreenApiState = {
  stateInstance: string;
};

export type GreenApiAccount = {
  exist: boolean;
  chatId: string;
  username?: string;
  phoneNumber?: number;
};

export type SendMessageResponse = {
  idMessage: string;
};

export type Message = {
  id: string;
  text: string;
  direction: "incoming" | "outgoing";
  timestamp: string;
};

export type GreenApiNotification = {
  receiptId: number;
  body: {
    typeWebhook: string;
    timestamp: number;
    idMessage: string;
    senderData: {
      chatId: string;
      chatName?: string;
      senderName?: string;
      senderContactName?: string;
      senderPhoneNumber?: number;
    };
    messageData: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
};

export type DeleteNotificationResponse = {
  result: boolean;
};
