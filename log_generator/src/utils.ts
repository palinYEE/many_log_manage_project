import { Faker, ko } from '@faker-js/faker';
import { IUser } from './interface/utils.interface';
import amqp from 'amqplib';

const koFaker = new Faker({
  locale: [ko],
});

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
export function generateRandomUser(): IUser {
  const userName = koFaker.person.fullName();
  const userEmail = koFaker.internet.email();
  return {
    name: userName,
    email: userEmail,
  };
}

export class rabbitmqHandlerClass {
  private mqId: string;
  private mqPassword: string;
  private mqHost: string;
  private mqPort: string;
  public connection: amqp.Connection | null;
  public channel: amqp.Channel | null;

  constructor() {
    this.mqId = process.env.RABBITMQ_ID as string;
    this.mqPassword = process.env.RABBITMQ_PASSWORD as string;
    this.mqHost = process.env.RABBITMQ_HOST as string;
    this.mqPort = process.env.RABBITMQ_PORT as string;
    this.connection = null;
    this.channel = null;
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

  async closeMQ() {
    if (this.connection !== null) {
      await this.connection.close();
      this.connection = null;
    } else {
      throw new Error('Rabbitmq 서버와 연결되어있지 않습니다.');
    }
  }
}
