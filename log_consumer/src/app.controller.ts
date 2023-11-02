import {
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { IUserAction } from './app.interface';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private logger = new Logger(AppController.name);

  @MessagePattern('big_log_test')
  async getBigLogSave(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      await this.appService.saveLogData(data['user'] as IUserAction);
    } catch (error) {
      throw new HttpException((error as Error).message, HttpStatus.BAD_REQUEST);
    }
  }

  @Cron(CronExpression.EVERY_SECOND)
  async bulkData() {
    try {
      console.debug(`[SCHEDULE] START Insert Bulk Data`);
      await this.appService.saveBuildData();
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('/change/batch_size')
  changeBatchCount(@Query('count') count: number) {
    this.appService.batchSize = count;
    this.logger.debug(`change batch size: ${count}`);
    return {
      message: 'change success',
    };
  }
}
