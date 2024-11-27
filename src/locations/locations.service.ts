import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './schemas/location.schema';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private readonly LocationModel: Model<Location>,
  ) {}

  async createLocation({ area, cubicle, room, service }: CreateLocationDto) {
    try {
      const location = new this.LocationModel({ area, cubicle, room, service });
      await location.save();

      return {
        message: 'Ubicación creada correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear la ubicación: ${error.message}`,
      );
    }
  }

  async findLocations() {
    try {
      const locations = await this.LocationModel.find();

      if (!locations || !locations.length) {
        throw new NotFoundException('No se encontraron ubicaciones creadas');
      }

      return locations;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al obtener las ubicaciones: ${error.message}`,
      );
    }
  }

  async findLocation(id: string) {
    try {
      const location = await this.LocationModel.findById(id);

      if (!location) {
        throw new NotFoundException('No se encontró la ubicación');
      }

      return location;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al obtener la ubicación: ${error.message}`,
      );
    }
  }

  async updateLocation(
    id: string,
    { area, cubicle, room, service }: UpdateLocationDto,
  ) {
    try {
      const updatedLocation = await this.LocationModel.findByIdAndUpdate(id, {
        area,
        cubicle,
        room,
        service,
      });

      if (!updatedLocation) {
        throw new NotFoundException('Ubicación no encontrada');
      }

      return {
        message: 'Ubicación actualizada correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la ubicación: ${error.message}`,
      );
    }
  }

  async deleteLocation(id: string) {
    try {
      const deletedLocation = await this.LocationModel.findByIdAndDelete(id);

      if (!deletedLocation) {
        throw new NotFoundException('Ubicación no encontrada');
      }

      return {
        message: 'Ubicación eliminada correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar la ubicación: ${error.message}`,
      );
    }
  }
}
