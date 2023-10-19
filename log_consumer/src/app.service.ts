import { IUserAction } from './app.interface';
import { UserRepository } from './app.repository';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AppService {
  constructor(private userRepository: UserRepository) {}

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
      this.userRepository.save(userData);
      this.logger.debug(`user sample data save: ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(`save error: ${error}`);
      throw error;
    }
  }
}
