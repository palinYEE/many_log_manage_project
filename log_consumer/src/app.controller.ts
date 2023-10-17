import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  RmqContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern()
  getNotifications(@Payload() data: any) {
    console.log(`data: ${JSON.stringify(data)}`);
  }
}
