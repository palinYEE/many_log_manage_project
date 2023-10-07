import express, { Request, Response } from 'express';
import * as utils from '../utils';
import { StatusCodes } from 'http-status-codes';
import { body } from 'express-validator';
import { TCustomLog } from '../interface/app.interface';
import { validatorErrorChecker } from '../middlewares/validators';
import { IUser } from '../interface/utils.interface';

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
      const userData = req.body as TCustomLog;
      console.debug(`유저 입력 데이터: ${JSON.stringify(userData)}`);
      const data: { log: string; user: IUser } = {
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

export default router;
