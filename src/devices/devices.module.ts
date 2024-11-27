import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schemas/devices.schema';
import { Data, DataSchema } from './schemas/data.schema';
import { Propertie, PropertieSchema } from './schemas/properties.schema';
import { DeviceService } from './devices.service';
import { DeviceController } from './devices.controller';
import {
  Location,
  LocationSchema,
} from 'src/locations/schemas/location.schema';

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
