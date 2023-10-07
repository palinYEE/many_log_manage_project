import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import apiRouters from './routers/api';

const app: Express = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/log', apiRouters);

app.listen(port, () => {
  console.log(`[server]: Server is running at <https://localhost>:${port}`);
});

module.exports = app;
