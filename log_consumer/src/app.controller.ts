import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('big_log_test')
  getNotifications(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(
      `Pattern: ${context.getPattern()} data: ${JSON.stringify(data)}`,
    );
  }

  @MessagePattern('big_log_test_2')
  getBigLogTest2(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(
      `Pattern: ${context.getPattern()} data: ${JSON.stringify(data)}`,
    );
  }

  @MessagePattern('big_log_test_3')
  getBigLogTest3(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(
      `Pattern: ${context.getPattern()} data: ${JSON.stringify(data)}`,
    );
  }
}
