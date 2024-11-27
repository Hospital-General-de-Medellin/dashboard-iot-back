import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  createLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.createLocation(createLocationDto);
  }

  @Get()
  findLocations() {
    return this.locationsService.findLocations();
  }

  @Get(':id')
  findLocation(@Param('id') id: string) {
    return this.locationsService.findLocation(id);
  }

  @Patch(':id')
  updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.updateLocation(id, updateLocationDto);
  }

  @Delete(':id')
  deleteLocation(@Param('id') id: string) {
    return this.locationsService.deleteLocation(id);
  }
}
