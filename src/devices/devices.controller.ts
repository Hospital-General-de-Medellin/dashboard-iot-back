import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DeviceService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  findDevices() {
    return this.deviceService.findDevices();
  }

  @Get(':deviceId')
  findDevice(@Param('deviceId') deviceId: string) {
    return this.deviceService.findDevice(deviceId);
  }

  @Post()
  async createDevice(@Body() device: CreateDeviceDto) {
    return await this.deviceService.createDevice(device);
  }
}
