import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

function rabbitmqURL() {
  // Rabbitmq 기본 계정을 다음과 같이 설정
  // id: admin, password: admin, host: localhost, port: 5672
  const id = process.env.RABBITMQ_ID
    ? (process.env.RABBITMQ_ID as string)
    : 'admin';
  const password = process.env.RABBITMQ_PASSWORD
    ? (process.env.RABBITMQ_PASSWORD as string)
    : 'admin';
  const host = process.env.RABBITMQ_HOST
    ? (process.env.RABBITMQ_HOST as string)
    : 'localhost';
  const port = process.env.RABBITMQ_PORT
    ? (process.env.RABBITMQ_PORT as string)
    : '5672';
  const rabbitmqURL = `amqp://${id}:${password}@${host}:${port}`;
  console.debug(`rabbitmq url: ${rabbitmqURL}`);
  return rabbitmqURL;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqURL()],
      queue: 'big_log_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  // 등록한 마이크로 서비스 실행 부분
  await app.startAllMicroservices();
  // port listen 부분
  await app.listen(3333);
}
bootstrap();
