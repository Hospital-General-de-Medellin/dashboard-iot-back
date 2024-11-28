import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocationsService } from 'src/api/locations/locations.service';
import { CreateLocationDto } from 'src/api/locations/dto/create-location.dto';
import { UpdateLocationDto } from 'src/api/locations/dto/update-location.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/enums/role.enum';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @Roles(Role.Admin)
  async findLocations() {
    return await this.locationsService.findLocations();
  }

  @Get(':id')
  @Roles(Role.Admin)
  async findLocation(@Param('id') id: string) {
    return await this.locationsService.findLocation(id);
  }

  @Post()
  @Roles(Role.Admin)
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationsService.createLocation(createLocationDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return await this.locationsService.updateLocation(id, updateLocationDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteLocation(@Param('id') id: string) {
    return await this.locationsService.deleteLocation(id);
  }
}
