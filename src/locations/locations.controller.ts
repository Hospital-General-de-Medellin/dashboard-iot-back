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

  @Get()
  async findLocations() {
    return await this.locationsService.findLocations();
  }

  @Get(':id')
  async findLocation(@Param('id') id: string) {
    return await this.locationsService.findLocation(id);
  }

  @Post()
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationsService.createLocation(createLocationDto);
  }

  @Patch(':id')
  async updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return await this.locationsService.updateLocation(id, updateLocationDto);
  }

  @Delete(':id')
  async deleteLocation(@Param('id') id: string) {
    return await this.locationsService.deleteLocation(id);
  }
}
