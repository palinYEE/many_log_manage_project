import { IUserAction } from './utils.interface';

export interface Ilog {
  log: string;
  user: IUserAction;
}

export interface ISendLog {
  pattern: string;
  data: Ilog;
}

export type TCustomLog = { log: string } & IUserAction;
