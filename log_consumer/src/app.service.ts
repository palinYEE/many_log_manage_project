import { IUserAction } from './app.interface';
import { UserRepository } from './app.repository';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AppService {
  constructor(private userRepository: UserRepository) {}

  private dataPool: UserEntity[] = [];
  private logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  async saveLogData(data: IUserAction) {
    try {
      const userData = new UserEntity();
      userData.name = data.name;
      userData.page = data.page;
      userData.action = data.action;
      userData.time = new Date(data.time);
      // this.userRepository.save(userData);
      this.dataPool.push(userData);
      // this.logger.debug(
      //   `user sample data list append: ${JSON.stringify(data)}`,
      // );
    } catch (error) {
      this.logger.error(`save error: ${error}`);
      throw error;
    }
  }

  async saveBuildData() {
    try {
      const tmp = this.dataPool;
      this.dataPool = [];
      if (tmp) {
        await this.userRepository.insert(tmp);
      }
      this.logger.debug(`SUCCESS save bulk data: ${tmp.length}`);
    } catch (error) {
      throw error;
    }
  }
}
