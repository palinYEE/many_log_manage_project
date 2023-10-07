import { IUser } from '../../src/interface/utils.interface';
import {
  generateRandomLog,
  generateRandomUser,
  rabbitmqHandlerClass,
} from '../../src/utils';

describe('유틸에 대한 테스트', () => {
  describe('랜덤 로그 생성 확인', () => {
    test('랜덤 로그 데이터가 형식에 맞게 생성되는지 확인 (format: this is sample log {랜덤 숫자}', () => {
      expect(generateRandomLog()).toMatch(/this is sample log \d+/);
    });
  });

  describe('랜덤 유저 데이터 생성 확인', () => {
    let testData: IUser;
    beforeAll(() => {
      testData = generateRandomUser();
    });
    test('name 필드의 타입이 string 인지 확인', () => {
      expect(typeof testData.name).toBe('string');
    });
    test('email 필드의 데이터가 이메일 형식을 가지고 있는지 확인', () => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      expect(testData.email).toMatch(emailRegex);
    });
  });
});

describe('Rabbitmq 관련 유틸 테스트', () => {
  process.env.NODE_ENV = 'development';
  process.env.RABBITMQ_ID = 'admin';
  process.env.RABBITMQ_PASSWORD = 'admin';
  process.env.RABBITMQ_PORT = '5672';
  describe('성공 시나리오', () => {
    process.env.RABBITMQ_HOST = 'localhost'; // local 에서 테스트 하기 때문에 host 를 localhost 로 함.
    const successMQClass = new rabbitmqHandlerClass();
    test('Rabbitmq 정상 연결 확인', async () => {
      await successMQClass.connnectMQ();
      expect(successMQClass.connection).not.toEqual(null);
    });
    test('Rabbitmq 채널 생성 확인', async () => {
      await successMQClass.createChannel();
      expect(successMQClass.channel).not.toEqual(null);
    });
    test('Rabbitmq 연결 해제 확인', async () => {
      await successMQClass.closeMQ();
      expect(successMQClass.connection).toEqual(null);
    });
  });
  describe('실패 시나리오', () => {
    process.env.RABBITMQ_HOST = 'error'; // local 에서 테스트 하기 때문에 host 를 localhost 로 함.
    const failMQClass = new rabbitmqHandlerClass();
    test('Rabbitmq 연결 실패 시 에러 반환 확인', async () => {
      let errorMessage: string = '';
      try {
        await failMQClass.connnectMQ();
      } catch (error) {
        errorMessage = (error as Error).message;
      }
      expect(errorMessage).not.toEqual('');
    });
    test('Rabbitmq 연결이 안된 상태에서 채널 생성 시 에러 반환 확인', async () => {
      let errorMessage: string = '';
      try {
        await failMQClass.createChannel();
      } catch (error) {
        errorMessage = (error as Error).message;
      }
      expect(errorMessage).not.toEqual('');
    });
    test('Rabbitmq 연결 안된 상태에서 연결 끊을 시 에러 반환 확인', async () => {
      let errorMessage: string = '';
      try {
        await failMQClass.closeMQ();
      } catch (error) {
        errorMessage = (error as Error).message;
      }
      expect(errorMessage).not.toEqual('');
    });
  });
});
