// import { Faker, ko } from '@faker-js/faker';
import { IUserAction } from './interface/utils.interface';
import amqp from 'amqplib';
import { ISendLog, Ilog } from './interface/app.interface';
import { USER_DATA_SET } from './data/user.data';
import { PAGE } from './data/page.data';
import { USER_ACTION } from './data/user_action.data';
import { Mutex } from 'async-mutex';

// const koFaker = new Faker({
//   locale: [ko],
// });

const mutex = new Mutex();

type TRabbitmqExchangeType = 'direct' | 'fanout' | 'topic' | 'headers';

/**
 * "this is sample log {랜덤 숫자}" 형식의 문자열을 생성하는 함수
 * @returns "this is sample log {랜덤 숫자}"
 */
export function generateRandomLog() {
  const randomNumber = Math.floor(Math.random() * 1000);
  return `this is sample log ${randomNumber}`;
}

/**
 * 랜덤 유저 정보를 생성해 주는 함수
 * @returns "{name: string, email: string}" 형식의 데이터를 반환
 */
export function generateRandomUser(): IUserAction {
  const userName =
    USER_DATA_SET[Math.floor(Math.random() * USER_DATA_SET.length)];
  const visitPage = PAGE[Math.floor(Math.random() * PAGE.length)];
  const userAction =
    USER_ACTION[Math.floor(Math.random() * USER_ACTION.length)];
  const actionTime = new Date().toISOString();
  return {
    name: userName,
    page: visitPage,
    action: userAction,
    time: actionTime,
  };
}

export class rabbitmqHandlerClass {
  private mqId: string;
  private mqPassword: string;
  private mqHost: string;
  private mqPort: string;
  public connection: amqp.Connection | null;
  public channel: amqp.Channel | null;
  public queue: amqp.Replies.AssertQueue | null;
  private queueName: string | null;
  public exchange: amqp.Replies.AssertExchange | null;
  private exchangeName: string | null;
  private routingKey: string | null;
  public sendDataCount: number;
  public drainDataCount: number;
  public resendQueue: unknown[];

  constructor() {
    this.mqId = process.env.RABBITMQ_ID as string;
    this.mqPassword = process.env.RABBITMQ_PASSWORD as string;
    this.mqHost = process.env.RABBITMQ_HOST as string;
    this.mqPort = process.env.RABBITMQ_PORT as string;
    this.connection = null;
    this.channel = null;
    this.queue = null;
    this.queueName = null;
    this.exchange = null;
    this.exchangeName = null;
    this.routingKey = null;
    this.sendDataCount = 0;
    this.drainDataCount = 0;
    this.resendQueue = [];
  }

  async connnectMQ() {
    const url = `amqp://${this.mqId}:${this.mqPassword}@${this.mqHost}:${this.mqPort}`;
    this.connection = await amqp.connect(url);
  }

  async createChannel() {
    if (this.connection !== null) {
      this.channel = await this.connection.createChannel();
    } else {
      throw new Error('Rabbitmq 서버와 연결되어있지 않습니다.');
    }
  }

  async createExchange(
    exchangeName: string,
    type: TRabbitmqExchangeType,
    option: amqp.Options.AssertExchange = {},
  ) {
    if (this.channel !== null) {
      this.exchange = await this.channel.assertExchange(
        exchangeName,
        type,
        option,
      );
      this.exchangeName = exchangeName;
    } else {
      throw new Error('Rabbitmq 채널이 존재하지 않습니다.');
    }
  }

  async createQueue(queueName: string, option: amqp.Options.AssertQueue = {}) {
    if (this.channel !== null) {
      this.queue = await this.channel.assertQueue(queueName, option);
      this.queueName = queueName;
    } else {
      throw new Error('Rabbitmq 채널이 존재하지 않습니다.');
    }
  }

  async bindingQueue(
    routingKey: string,
    headers: Record<string, string | number> = {},
  ) {
    if (
      this.queue !== null &&
      this.exchange !== null &&
      this.channel !== null
    ) {
      await this.channel.bindQueue(
        this.queueName!,
        this.exchangeName!,
        routingKey,
        headers,
      );
      this.routingKey = routingKey;
    } else {
      const errorMessages: string[] = [];
      this.queue === null ? errorMessages.push('생성된 큐가 없습니다.') : '';
      this.exchange === null
        ? errorMessages.push('생성된 exchange가 없습니다.')
        : '';
      this.channel === null
        ? errorMessages.push('Rabbitmq 채널이 존재하지 않습니다.')
        : '';
      throw new Error(errorMessages.join(' | '));
    }
  }

  async closeMQ() {
    if (this.connection !== null) {
      await this.connection.close();
      this.connection = null;
    } else {
      throw new Error('Rabbitmq 서버와 연결되어있지 않습니다.');
    }
  }

  async rePublish() {
    try {
      // 이와 같이 작성 되어있으면 1초에 하나의 데이터만 다시 넣는다.
      const release = await mutex.acquire();
      const data = this.resendQueue.shift(); // mutex lock
      // if (data) {
      //   console.log(`[*] mutex lock - ${JSON.stringify(data)}`);
      // }
      release(); // mutex unlock

      // console.log(data);
      if (
        this.connection !== null &&
        this.channel !== null &&
        this.queue !== null &&
        this.exchange !== null &&
        this.exchangeName !== null &&
        this.routingKey !== null &&
        data !== undefined
      ) {
        const resendResult = await this.channel.publish(
          this.exchangeName,
          this.routingKey,
          Buffer.from(JSON.stringify(data)),
        );
        if (resendResult) {
          this.drainDataCount -= 1;
        } else {
          this.resendQueue.push(data);
        }
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  async publish(
    data: Ilog,
    pattern: string,
    option: Record<string, string | number> = {},
  ) {
    if (
      this.connection !== null &&
      this.channel !== null &&
      this.queue !== null &&
      this.exchange !== null &&
      this.routingKey !== null
    ) {
      const sendData: ISendLog = {
        pattern: pattern,
        data: data,
      };
      const resultFlag = this.channel.publish(
        this.exchangeName!,
        this.routingKey,
        Buffer.from(JSON.stringify(sendData)),
        option,
      );
      if (resultFlag) {
        // console.debug(`Rabbitmq 데이터 전송 완료`);
        // console.debug(`   - pattern: ${pattern}`);
        // console.debug(`   - exhange: ${this.exchangeName}`);
        // console.debug(`   - routingKey: ${this.routingKey}`);
        // console.debug(`   - data: ${JSON.stringify(data)}`);
        this.sendDataCount += 1;
        // console.log(
        //   `     - sendDataCount/drainDataCount: ${this.sendDataCount}/${this.drainDataCount}`,
        // );
      } else {
        // console.debug(
        //   `Rabbit 전송 실패 ==> drain 이벤트를 발생시킵니다. sendDataCount/drainDataCount: ${this.sendDataCount}/${this.drainDataCount}`,
        // );
        this.drainDataCount += 1;
        this.channel.once('drain', () => {
          // console.debug(
          //   ` drain 데이터 재전송 ==> sendDataCount/drainDataCount: ${this.sendDataCount}/${this.drainDataCount}`,
          // );
          // this.channel!.publish(
          //   this.exchangeName!,
          //   this.routingKey!,
          //   Buffer.from(JSON.stringify(sendData)),
          //   option,
          // );
          // this.drainDataCount -= 1;
          this.resendQueue.push(sendData);
          this.sendDataCount += 1;
        });
      }
    } else {
      const errorMessages: string[] = [];
      this.connection === null
        ? errorMessages.push('Rabbitmq 서버와 연결되어있지 않습니다.')
        : '';
      this.exchange === null
        ? errorMessages.push('생성된 exchange가 없습니다.')
        : '';
      this.channel === null
        ? errorMessages.push('Rabbitmq 채널이 존재하지 않습니다.')
        : '';
      this.queue === null ? errorMessages.push('생성된 큐가 없습니다.') : '';
      this.routingKey === null
        ? errorMessages.push('설정된 라우팅 키가 없습니다.')
        : '';
      throw new Error(errorMessages.join(' | '));
    }
  }
}
