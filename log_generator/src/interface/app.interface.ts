import { IUser } from './utils.interface';

export interface Ilog {
  log: string;
  user: IUser;
}

export type TCustomLog = { log: string } & IUser;
