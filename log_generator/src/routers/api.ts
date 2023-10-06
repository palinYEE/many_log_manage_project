import express, { Request, Response } from 'express';
import * as utils from '../utils';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.get('/random', (req: Request, res: Response) => {
  try {
    const logMessage = utils.generateRandomLog();
    const user = utils.generateRandomUser();
    res.send({ log: logMessage, ...user });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errorMessage: (error as Error).message });
  }
});

export default router;
