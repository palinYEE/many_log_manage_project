import { IUser } from './utils.interface';

export interface Ilog {
  log: string;
  user: IUser;
}

export interface ISendLog {
  pattern: string;
  data: Ilog;
}

export type TCustomLog = { log: string } & IUser;
