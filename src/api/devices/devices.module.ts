import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from 'src/api/devices/schemas/devices.schema';
import { Data, DataSchema } from 'src/api/devices/schemas/data.schema';
import {
  Propertie,
  PropertieSchema,
} from 'src/api/devices/schemas/properties.schema';
import { DeviceService } from 'src/api/devices/devices.service';
import { DeviceController } from 'src/api/devices/devices.controller';
import {
  Location,
  LocationSchema,
} from 'src/api/locations/schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: Data.name, schema: DataSchema },
      { name: Propertie.name, schema: PropertieSchema },
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
