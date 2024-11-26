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

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: Model<Device>,
    @InjectModel(Data.name) private readonly dataModel: Model<Data>,
    @InjectModel(Propertie.name)
    private readonly propertiesModel: Model<Propertie>,
  ) {}

  async createDevice({
    sysId,
    deviceId,
    applicationName,
    data,
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
          data: [], // Inicializar el array de datos vacío
        });

        // Guardamos el nuevo dispositivo
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
      const { minute, ...properties } = data; // Separar el minuto del resto de las propiedades

      const newPropertie = new this.propertiesModel({
        minute, // Asigna el minuto como una propiedad separada
        properties: new Map(Object.entries(properties)), // Convierte las propiedades restantes a un Map
      });
      await newPropertie.save();

      dataInterval.properties.push(newPropertie._id as Propertie);
      await dataInterval.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el dispositivo: ${error.message}`,
      );
    }
  }

  async getDevice(id: string) {
    try {
      const device = await this.deviceModel
        .findOne({ id })
        .populate({
          path: 'data',
          populate: {
            path: 'properties',
          },
        })
        .exec();

      if (!device) {
        throw new NotFoundException(
          `No se encontró el dispositivo ${id}`,
        );
      }

      return device;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el dispositivo ${id}: ${error.message}`,
      );
    }
  }

  async getAllDevices() {
    try {
      const devices = await this.deviceModel
        .find()
        .populate('data.properties')
        .exec();

      if (!devices || !devices.length) {
        throw new NotFoundException(`No se encontraron dispositivos creados`);
      }

      return devices;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error obteniendo los dispositivos: ${error.message}`,
      );
    }
  }
}
