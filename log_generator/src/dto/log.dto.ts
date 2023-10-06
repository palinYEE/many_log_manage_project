import { Ilog } from '../interface/app.interface';
import { IUser } from '../interface/utils.interface';

class LogDTO {
  log: string;
  user: IUser;
  constructor(data: Ilog) {
    this.log = data.log;
    this.user = data.user;
  }
}

module.exports = {
  LogDTO,
};
