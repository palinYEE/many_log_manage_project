import { Tlog } from '../app.interface';

class LogDTO {
  log: string;
  user: string;
  constructor(data: Tlog) {
    this.log = data.log;
    this.user = data.user;
  }
}

module.exports = {
  LogDTO,
};
