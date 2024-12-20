import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from 'src/api/devices/schemas/devices.schema';
import { Data } from 'src/api/devices/schemas/data.schema';
import { Propertie } from 'src/api/devices/schemas/properties.schema';
import { CreateDeviceDto } from 'src/api/devices/dto/create-device.dto';
import { Location } from 'src/api/locations/schemas/location.schema';
import { UpdateDeviceDto } from 'src/api/devices/dto/update-device.dto';

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
        let location = null;

        if (locationId) {
          location = await this.locationModel.findById(locationId);

          if (!location) {
            throw new NotFoundException('No se encontró la ubicación');
          }
        }

        // Crear y guardar el nuevo dispositivo
        device = new this.deviceModel({
          sysId,
          deviceId,
          applicationName,
          data: [],
          location,
        });

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
        return [];
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

  async filterByShift(shift: 'day' | 'night'): Promise<Device[]> {
    if (shift !== 'day' && shift !== 'night') {
      throw new BadRequestException('El turno debe ser "day" o "night"');
    }

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

      const filteredDevices = devices.map((device) => {
        const filteredData = device.data.filter((entry) => {
          const timestamp = new Date(entry.timestamp);
          const hour = (timestamp.getUTCHours() + -5 + 24) % 24;

          const isDay = hour >= 6 && hour < 18;
          const isNight = hour < 6 || hour >= 18;

          if (shift === 'day') {
            return isDay;
          } else if (shift === 'night') {
            return isNight;
          }

          return false; // Si el turno no es válido
        });

        if (!filteredData || !filteredData.length) {
          throw new NotFoundException('No se encontraron datos para el turno');
        }

        return {
          ...device.toObject(),
          data: filteredData,
        };
      });

      return filteredDevices as Device[];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al aplicar los filtros: ${error.message}`,
      );
    }
  }

  async filterByDateRange(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      throw new BadRequestException(
        'Debes proporcionar las fechas de inicio y fin',
      );
    }

    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/; // Valida formato YYYY/MM/DD

    if (startDate && !dateRegex.test(startDate)) {
      throw new BadRequestException('startDate must be in YYYY/MM/DD format');
    }

    if (endDate && !dateRegex.test(endDate)) {
      throw new BadRequestException('endDate must be in YYYY/MM/DD format');
    }

    try {
      const data = await this.dataModel
        .find({
          timestamp: {
            $gte: startDate,
            $lt: endDate + ' 23:59:59',
          },
        })
        .exec();

      if (!data || !data.length) {
        throw new NotFoundException('No se encontraron datos para la fecha');
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al aplicar los filtros: ${error.message}`,
      );
    }
  }

  async filterByPeriodicity(
    period: 'minute' | 'hour' | 'day' | 'month' | 'year',
  ) {
    if (
      period !== 'minute' &&
      period !== 'hour' &&
      period !== 'day' &&
      period !== 'month' &&
      period !== 'year'
    ) {
      throw new BadRequestException(
        'El periodo debe ser "minute", "hour", "day", "month" o "year"',
      );
    }

    try {
      if (period === 'year') {
        const dataByYear = await this.dataModel.find({
          timestamp: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear() + 1, 0, 1),
          },
        });

        if (!dataByYear || !dataByYear.length) {
          throw new NotFoundException('No se encontraron datos para el año');
        }

        return dataByYear;
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al aplicar los filtros: ${error.message}`,
      );
    }
  }
}
