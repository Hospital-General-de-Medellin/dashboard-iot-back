import { Bind, Controller } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';
import { Public } from 'src/common/decorators/auth.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Bind(Payload(), Ctx())
  @MessagePattern('v3/hgm-maga@ttn/devices/#')
  getDataBytes(data, context) {
    return this.appService.worker(data);
  }
}
