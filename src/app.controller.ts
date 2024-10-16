import { Bind, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Bind(Payload(), Ctx())
  @MessagePattern('v3/hgm-maga@ttn/devices/#')
  getNotifications(data, context) {
    console.log(data);
    console.log(`Topic: ${context.getTopic()}`);
  }
}
