import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DeviceService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  async getAllDevices() {
    return await this.deviceService.getAllDevices();
  }

  @Get(':deviceId')
  async getDeviceData(@Param('deviceId') deviceId: string) {
    return await this.deviceService.getDevice(deviceId);
  }

  @Post()
  async createDevice(@Body() device: CreateDeviceDto) {
    await this.deviceService.createDevice(device);

    return `Dispositivo ${device.deviceId} creado exitosamente`;
  }
}
