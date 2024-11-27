import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from './schemas/devices.schema';
import { Data } from './schemas/data.schema';
import { Propertie } from './schemas/properties.schema';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Location } from 'src/locations/schemas/location.schema';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: Model<Device>,
    @InjectModel(Data.name) private readonly dataModel: Model<Data>,
    @InjectModel(Propertie.name)
    private readonly propertiesModel: Model<Propertie>,
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
  ) {}

  async createDevice({
    sysId,
    deviceId,
    applicationName,
    data,
    locationId,
  }: CreateDeviceDto) {
    try {
      const timestamp = new Date();
      const intervalStart = new Date(timestamp);
      intervalStart.setMinutes(0, 0, 0); // Agrupar por hora, por ejemplo

      // Buscar el documento de dispositivo
      let device = await this.deviceModel.findOne({ sysId, deviceId });

      if (!device) {
        // Si no se encuentra, creamos un nuevo dispositivo
        device = new this.deviceModel({
          sysId,
          deviceId,
          applicationName, // Aquí deberías definir cómo obtener o asignar el nombre de la aplicación
          data: [], // Inicializar el array de datos vacío,
          location: null,
        });

        // Guardamos el nuevo dispositivo
        await device.save();
      } else if (!device.location && locationId) {
        const location = await this.locationModel.findById(locationId);

        if (!location) {
          throw new NotFoundException('No se encontró la ubicación');
        }

        device.location = location;

        await device.save();
      }

      // Buscar el subdocumento de datos para el intervalo actual
      let dataInterval = await this.dataModel.findOne({
        _id: { $in: device.data },
        timestamp: intervalStart,
      });

      if (!dataInterval) {
        // Si no existe el intervalo, crear uno nuevo
        dataInterval = new this.dataModel({
          timestamp: intervalStart,
          properties: [],
        });
        device.data.push(dataInterval._id as Data);
        await device.save();
        await dataInterval.save();
      }

      // Crear la nueva lectura y agregarla al intervalo
      if (data) {
        const { minute, ...properties } = data;

        const newPropertie = new this.propertiesModel({
          minute, // Asigna el minuto como una propiedad separada
          properties: new Map(Object.entries(properties)), // Convierte las propiedades restantes a un Map
        });
        await newPropertie.save();

        dataInterval.properties.push(newPropertie._id as Propertie);
        await dataInterval.save();
      }

      return {
        message: 'Dispositivo creado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al crear el dispositivo: ${error.message}`,
      );
    }
  }

  async findDevice(id: string) {
    try {
      const device = await this.deviceModel.findById(id).populate({
        path: 'data',
        populate: {
          path: 'properties',
        },
      });

      if (!device) {
        throw new NotFoundException('No se encontró el dispositivo');
      }

      return device;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al obtener el dispositivo: ${error.message}`,
      );
    }
  }

  async findDevices() {
    try {
      const devices = await this.deviceModel
        .find()
        .populate({
          path: 'data',
          populate: {
            path: 'properties',
          },
        })
        .populate('location');

      if (!devices || !devices.length) {
        throw new NotFoundException('No se encontraron dispositivos creados');
      }

      return devices;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al obtener los dispositivos: ${error.message}`,
      );
    }
  }

  async updateDevice(
    id: string,
    { sysId, deviceId, applicationName, data, locationId }: UpdateDeviceDto,
  ) {
    try {
      const updatedDevice = await this.deviceModel.findByIdAndUpdate(id, {
        sysId,
        deviceId,
        applicationName,
        data,
        location: locationId,
      });

      if (!updatedDevice) {
        throw new NotFoundException('Dispositivo no encontrado');
      }

      return {
        message: 'Dispositivo actualizado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al actualizar el dispositivo: ${error.message}`,
      );
    }
  }

  async deleteDevice(id: string) {
    try {
      const deletedDevice = await this.deviceModel.findByIdAndDelete(id);

      if (!deletedDevice) {
        throw new NotFoundException('Dispositivo no encontrado');
      }

      return {
        message: 'Dispositivo eliminado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al eliminar el dispositivo: ${error.message}`,
      );
    }
  }
}
