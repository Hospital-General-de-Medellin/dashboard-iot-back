import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './schemas/projects.schema';
import { CreateProjectDto } from 'src/api/projects/dto/create-project.dto';
import { Device } from 'src/api/devices/schemas/devices.schema';
import { UpdateProjectDto } from 'src/api/projects/dto/update-project.dto';
import { UsersService } from 'src/api/users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Device.name) private readonly deviceModel: Model<Device>,
    private readonly UsersService: UsersService,
  ) {}

  async createProject({ name, chartType, devices }: CreateProjectDto) {
    try {
      const devicesFound = await this.deviceModel.find({
        _id: { $in: devices },
      });

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
        devices,
      });

      await newProject.save();

      return {
        message: 'Proyecto creado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al crear el proyecto: ${error.message}`,
      );
    }
  }

  async findProjects(userId?: string) {
    try {
      if (userId) {
        const user = await this.UsersService.findUser(userId);

        if (!user) {
          throw new NotFoundException('Usuario no encontrado');
        }

        return user.projects;
      }

      const projects = await this.projectModel.find().populate('devices');

      if (!projects || !projects.length) {
        throw new NotFoundException(`No se encontraron proyectos creados`);
      }

      return projects;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al obtener los proyectos: ${error.message}`,
      );
    }
  }

  async findProject(id: string) {
    try {
      const project = await this.projectModel.findById(id).populate({
        path: 'devices',
        populate: {
          path: 'data',
          populate: {
            path: 'properties', // Si 'properties' es un subdocumento de 'Data'
          },
        },
      });

      if (!project) {
        throw new NotFoundException('No se encontró el proyecto');
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al obtener el proyecto: ${error.message}`,
      );
    }
  }

  async updateProject(
    id: string,
    { name, chartType, devices }: UpdateProjectDto,
  ) {
    try {
      const project = await this.projectModel.findById(id);

      if (!project) {
        throw new NotFoundException('Proyecto no encontrado');
      }

      const devicesFound = await this.deviceModel.find({
        _id: { $in: devices },
      });

      if (devicesFound.length !== devices.length) {
        throw new NotFoundException(
          `Algunos dispositivos no fueron encontrados: ${devices.filter(
            (id) =>
              !devicesFound.some((device) => device._id.toString() === id),
          )}`,
        );
      }

      // Combinar dispositivos existentes con los nuevos, evitando duplicados
      const updatedDevices = Array.from(
        new Set([
          ...project.devices.map((device) => device.toString()),
          ...devices,
        ]),
      );

      const updatedProject = await this.projectModel.findByIdAndUpdate(id, {
        name,
        chartType,
        devices: updatedDevices,
      });

      if (!updatedProject) {
        throw new NotFoundException('Proyecto no encontrado');
      }

      return {
        message: 'Proyecto actualizado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al actualizar el proyecto: ${error.message}`,
      );
    }
  }

  async deleteProject(id: string) {
    try {
      const deletedProject = await this.projectModel.findByIdAndDelete(id);

      if (!deletedProject) {
        throw new NotFoundException('Proyecto no encontrado');
      }

      return {
        message: 'Proyecto eliminado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al eliminar el proyecto: ${error.message}`,
      );
    }
  }
}
