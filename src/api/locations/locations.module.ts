import { Module } from '@nestjs/common';
import { LocationsService } from 'src/api/locations/locations.service';
import { LocationsController } from 'src/api/locations/locations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Location,
  LocationSchema,
} from 'src/api/locations/schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}