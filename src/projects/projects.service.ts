import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './schemas/projects.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { Device } from 'src/devices/schemas/devices.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Device.name) private readonly deviceModel: Model<Device>,
  ) {}

  async createProject({
    name,
    chartType,
    frequency,
    devices,
  }: CreateProjectDto) {
    try {
      const devicesFound = await this.deviceModel
        .find({ _id: { $in: devices } })
        .exec();

      // Validar si el número de dispositivos encontrados es igual al número de IDs proporcionados
      if (devicesFound.length !== devices.length) {
        throw new NotFoundException(
          `Algunos dispositivos no fueron encontrados: ${devices.filter(
            (id) =>
              !devicesFound.some((device) => device._id.toString() === id),
          )}`,
        );
      }

      const newProject = new this.projectModel({
        name,
        chartType,
        frequency,
        devices,
      });

      return newProject.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el proyecto: ${error.message}`,
      );
    }
  }

  async getProjects() {
    try {
      const projects = await this.projectModel
        .find()
        .populate('devices')
        .exec();

      if (!projects || !projects.length) {
        throw new NotFoundException(`No se encontraron proyectos creados`);
      }

      return projects;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error obteniendo los proyectos: ${error.message}`,
      );
    }
  }

  async getProject(id: string) {
    try {
      const project = await this.projectModel
        .findById(id)
        .populate({
          path: 'devices',
          populate: {
            path: 'data',
            populate: {
              path: 'properties', // Si 'properties' es un subdocumento de 'Data'
            },
          },
        })
        .exec();

      if (!project) {
        throw new NotFoundException(`No se encontró el proyecto: ${id}`);
      }

      return project;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el proyecto ${id}: ${error.message}`,
      );
    }
  }
}
