import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { DeviceService } from 'src/api/devices/devices.service';
import { CreateDeviceDto } from 'src/api/devices/dto/create-device.dto';
import { UpdateDeviceDto } from 'src/api/devices/dto/update-device.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/enums/role.enum';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  async findDevices(
    @Query('shift') shift?: 'day' | 'night',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (shift) {
      return await this.deviceService.filterByShift(shift);
    }

    if (startDate && endDate) {
      return await this.deviceService.filterByDateRange(startDate, endDate);
    }

    if (!startDate && !endDate && !shift) {
      return await this.deviceService.findDevices();
    }
  }

  @Get(':id')
  async findDevice(@Param('id') id: string) {
    return await this.deviceService.findDevice(id);
  }

  @Post()
  @Roles(Role.Admin)
  async createDevice(@Body() device: CreateDeviceDto) {
    return await this.deviceService.createDevice(device);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async updateDevice(@Param('id') id: string, @Body() device: UpdateDeviceDto) {
    return await this.deviceService.updateDevice(id, device);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteDevice(@Param('id') id: string) {
    return await this.deviceService.deleteDevice(id);
  }
}
