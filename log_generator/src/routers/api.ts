import express, { Request, Response } from 'express';
import * as utils from '../utils';
import { StatusCodes } from 'http-status-codes';
import { body } from 'express-validator';
import { validatorErrorChecker } from '../middlewares/validators';
import { config } from '../config/app.config';

const router = express.Router();

router.get('/random', (req: Request, res: Response) => {
  try {
    const logMessage = utils.generateRandomLog();
    const user = utils.generateRandomUser();
    res.send({ log: logMessage, ...user });
  } catch (error) {
    console.error(
      `데이터 생성에 실패하였습니다. - ${(error as Error).message}`,
    );
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errorMessage: '데이터 생성에 실패하였습니다.' });
  }
});

router.post(
  '/custom',
  [
    body('name').exists(),
    body('log').exists(),
    body('email').exists().isEmail(),
    validatorErrorChecker,
  ],
  (req: Request, res: Response) => {
    try {
      const userData = req.body;
      console.debug(`유저 입력 데이터: ${JSON.stringify(userData)}`);
      const data: { log: string; user: unknown } = {
        log: userData.log,
        user: {
          name: userData.name,
          email: userData.email,
        },
      };
      res.send(data);
    } catch (error) {
      console.error(
        `데이터 생성에 실패하였습니다. - ${(error as Error).message}`,
      );
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errorMessage: '데이터 생성에 실패하였습니다.' });
    }
  },
);

router.post('/start', (req: Request, res: Response) => {
  try {
    if (config.schedule_flag) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errorMessage: '이미 스케줄이 동작 중입니다.' });
    } else {
      config.schedule_flag = true;
      console.debug('로그 전송 스케줄을 시작합니다.');
      res.send();
    }
  } catch (error) {
    console.error(
      `스케줄 시작에 실패하였습니다. - ${(error as Error).message}`,
    );
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errorMessage: '스케줄 시작에 실패하였습니다.' });
  }
});

router.post('/stop', (req: Request, res: Response) => {
  try {
    if (!config.schedule_flag) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errorMessage: '이미 스케줄이 동작 중이 아닙니다.' });
    } else {
      config.schedule_flag = false;
      console.debug('로그 전송 스케줄을 종료합니다.');
      res.send();
    }
  } catch (error) {
    console.error(
      `스케줄 종료에 실패하였습니다. - ${(error as Error).message}`,
    );
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errorMessage: '스케줄 종료에 실패하였습니다.' });
  }
});

export default router;
