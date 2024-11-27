import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Device } from 'src/devices/schemas/devices.schema';
import { Model } from 'mongoose';
import { Location } from './schemas/location.schema';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private readonly LocationModel: Model<Location>,
    @InjectModel(Device.name) private readonly deviceModel: Model<Device>,
  ) {}

  async createLocation({ area, cubicle, room, service }: CreateLocationDto) {
    try {
      const location = new this.LocationModel({ area, cubicle, room, service });
      await location.save();

      return {
        message: 'Ubicación creada exitosamente',
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error al crear la ubicación: ${error.message}`,
      });
    }
  }

  async findLocations() {
    try {
      const locations = await this.LocationModel.find().exec();

      if (!locations || !locations.length) {
        throw new NotFoundException('No se encontraron ubicaciones creadas');
      }

      return locations;
    } catch (error) {
      return error;
    }
  }

  async findLocation(id: string) {
    try {
      const location = await this.LocationModel.findById(id).exec();

      if (!location) {
        throw new NotFoundException('No se encontró la ubicación');
      }

      return location;
    } catch (error) {
      return error;
    }
  }
}
