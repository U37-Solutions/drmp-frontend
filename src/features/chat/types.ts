export enum MessageType {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

export enum SenderType {
  CLIENT = 'client',
  ADMIN = 'admin',
}

type ChatLastMessage = {
  message: string;
  time: string;
};

export type Chat = {
  accessToken: string;
  id: number;
  companyId: number;
  name: string;
  avatar: string | null;
  lastMessage: ChatLastMessage;
  expiresAt: string;
};

export type ActiveCompanyChat = {
  companyId: number;
  companyName: string;
  companyAvatar: string | null;
};

export type StartNewChat = {
  company: {
    id: number;
    name: string;
  };
  message: string;
};

export type StartNewChatResponse = {
  chatId: number;
  accessToken: string;
  expiresAt: string;
};

export type ChatHistory = {
  chatId: number;
  content: string;
  type: MessageType;
  sentAt: string;
};

export type ChatHistoryResponse = {
  chatId: number;
  content: string;
  senderType: SenderType;
  sentAt: string;
  accessToken: string;
};
