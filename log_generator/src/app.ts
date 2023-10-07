import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import apiRouters from './routers/api';

const app: Express = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/log', apiRouters);

app.listen(port, () => {
  console.debug(
    `==============================================================================`,
  );
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
});

module.exports = app;
