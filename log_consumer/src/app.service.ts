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

  public batchSize = 100;

  private chunkList(originalList, chunkSize) {
    // 결과를 담을 이중 리스트 초기화
    const chunkedList = [];

    // 주어진 리스트를 청크 크기만큼 잘라 새로운 이중 리스트를 생성
    for (let i = 0; i < originalList.length; i += chunkSize) {
      // Array.prototype.slice를 사용하여 서브 리스트를 생성
      const chunk = originalList.slice(i, i + chunkSize);
      // 생성된 청크를 결과 리스트에 추가
      chunkedList.push(chunk);
    }

    return chunkedList;
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
      const sliceDataPoll = this.chunkList(tmp, this.batchSize);
      if (tmp) {
        const promises = sliceDataPoll.map((item) => {
          // userRepository.save(item)은 비동기 함수라고 가정합니다.
          // 이 함수는 프로미스를 반환해야 합니다.
          return this.userRepository.save(item);
        });
        await Promise.all(promises);
      }
      this.logger.debug(`SUCCESS save bulk data: ${tmp.length}`);
    } catch (error) {
      throw error;
    }
  }
}
