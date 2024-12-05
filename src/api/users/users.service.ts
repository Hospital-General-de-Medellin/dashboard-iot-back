import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/api/users/dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/api/users/schemas/user.schema';
import { Project } from 'src/api/projects/schemas/projects.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  async createUser({ email, name, password, role, projects }: CreateUserDto) {
    try {
      const user = new this.userModel({
        email,
        name,
        password,
        role,
        projects,
      });

      await user.save();

      return {
        message: 'Usuario creado correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el usuario: ${error.message}`,
      );
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al obtener el usuario: ${error.message}`,
      );
    }
  }

  async findUser(id?: string, email?: string) {
    try {
      if (id) {
        const user = await this.userModel.findById(id).populate('projects');

        if (!user) {
          throw new NotFoundException('Usuario no encontrado');
        }

        return user;
      }

      if (email) {
        const user = await this.userModel.findOne({ email });

        if (!user) {
          throw new NotFoundException('Usuario no encontrado');
        }

        return user;
      }

      return null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al obtener el usuario: ${error.message}`,
      );
    }
  }

  async updateUser(id: string, { name, email, projects, role }: UpdateUserDto) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const verifiedProjects = await Promise.all(
        projects.map(async (projectId) => {
          const project = await this.projectModel.findById(projectId);

          if (!project) {
            throw new NotFoundException(
              `Proyecto con ID ${projectId} no encontrado`,
            );
          }

          return project._id; // Retornar el ID del proyecto validado
        }),
      );

      const updatedProjects = Array.from(
        new Set([
          ...user.projects.map((project) => project.toString()),
          ...verifiedProjects,
        ]),
      );

      await this.userModel.updateOne(
        { _id: id },
        { name, email, projects: updatedProjects, role },
      );

      return {
        message: 'Usuario actualizado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al actualizar el usuario: ${error.message}`,
      );
    }
  }
}
