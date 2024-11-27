import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DeviceService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

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

  @Patch(':deviceId')
  async updateDevice(
    @Param('deviceId') deviceId: string,
    @Body() device: UpdateDeviceDto,
  ) {
    return await this.deviceService.updateDevice(deviceId, device);
  }

  @Delete(':deviceId')
  async deleteDevice(@Param('deviceId') deviceId: string) {
    return await this.deviceService.deleteDevice(deviceId);
  }
}
