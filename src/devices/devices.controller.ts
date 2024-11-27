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
  async findDevices() {
    return await this.deviceService.findDevices();
  }

  @Get(':id')
  async findDevice(@Param('id') id: string) {
    return await this.deviceService.findDevice(id);
  }

  @Post()
  async createDevice(@Body() device: CreateDeviceDto) {
    return await this.deviceService.createDevice(device);
  }

  @Patch(':id')
  async updateDevice(
    @Param('id') id: string,
    @Body() device: UpdateDeviceDto,
  ) {
    return await this.deviceService.updateDevice(id, device);
  }

  @Delete(':id')
  async deleteDevice(@Param('id') id: string) {
    return await this.deviceService.deleteDevice(id);
  }
}
