import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DeviceService } from './devices.service';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  async getAllDevices() {
    return await this.deviceService.getAllDevices();
  }

  @Get(':sysId')
  async getDeviceData(@Param('sysId') sysId: number) {
    return await this.deviceService.getDeviceData(sysId);
  }

  // @Post('properties')
  // async addProperties(@Body() data: { sysId: number; properties: number[] }) {
  //   const sysId = data.sysId;
  //   const [cleanHands, dirtyHands, boxChanes] = data.properties;

  //   await this.deviceService.createDevice(sysId, {
  //     minute: new Date().getMinutes(),
  //     cleanHands,
  //     dirtyHands,
  //     boxChanes,
  //   });

  //   return { message: 'Properties saved successfully' };
  // }
}
