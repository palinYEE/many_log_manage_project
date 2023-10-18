import cron from 'node-cron';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import apiRouters from './routers/api';
import {
  generateRandomLog,
  generateRandomUser,
  rabbitmqHandlerClass,
} from './utils';
import { IUserAction } from './interface/utils.interface';
import { Ilog } from './interface/app.interface';
import { config } from './config/app.config';

const app: Express = express();
const port = 3000;

const rabbitmq = new rabbitmqHandlerClass();

app.use(bodyParser.json());
app.use('/log', apiRouters);

app.listen(port, async () => {
  console.debug();
  console.debug(`[server]: Server is running at <https://localhost>:${port}`);
  console.debug(`[server]: process info`);
  console.debug(`             - TimeZone              : ${process.env.TZ}`);
  console.debug(
    `             - node env              : ${process.env.NODE_ENV}`,
  );
  console.debug(
    `             - rabbitmq host         : ${process.env.RABBITMQ_HOST}`,
  );
  console.debug(
    `             - rabbitmq port         : ${process.env.RABBITMQ_PORT}`,
  );
  console.debug(
    `             - mysql host            : ${process.env.MYSQL_HOST}`,
  );
  console.debug(
    `             - mysql port            : ${process.env.MYSQL_PORT}`,
  );
  console.debug(
    `             - schedule status       : ${config.schedule_flag}`,
  );
  console.debug(
    `==============================================================================`,
  );
  await rabbitmq.connnectMQ();
  await rabbitmq.createChannel();
  await rabbitmq.createExchange('big_log_exchange', 'direct', {
    durable: true,
  });
  await rabbitmq.createQueue('big_log_queue', {
    durable: true,
  });
  await rabbitmq.bindingQueue('big_log_routingKey');
});

cron.schedule('* * * * * *', async () => {
  if (config.schedule_flag) {
    const randomUser: IUserAction = generateRandomUser();
    const randomLogString = generateRandomLog();
    const randomData: Ilog = {
      log: randomLogString,
      user: randomUser,
    };
    await rabbitmq.publish(randomData, 'big_log_test');
    await rabbitmq.publish(randomData, 'big_log_test_2');
    await rabbitmq.publish(randomData, 'big_log_test_3');
  }
});

module.exports = app;
