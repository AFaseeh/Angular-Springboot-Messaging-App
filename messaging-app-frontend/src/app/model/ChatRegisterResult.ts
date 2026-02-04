import { ChatUser } from './ChatUser';

export type ChatRegisterResult = {
  user: {
    id: number,
    name: string,
    userName: string,
  };
  error: ChatRegisterError;
  token: string;
};

export type ChatRegisterError = {
  field: string;
  message: string;
};
