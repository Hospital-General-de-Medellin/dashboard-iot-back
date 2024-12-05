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

      if (projects?.length) {
        const verifiedProjects = await Promise.all(
          projects?.map(async (projectId) => {
            const project = await this.projectModel.findById(projectId);

            if (!project) {
              throw new NotFoundException(
                `Proyecto con ID ${projectId} no encontrado`,
              );
            }

            return project._id as Project;
          }),
        );

        verifiedProjects?.map((project) => {
          if (!user.projects.includes(project)) {
            user.projects.push(project);
          } else {
            user.projects = user.projects.filter(
              (p) => p.toString() !== project.toString(),
            );
          }
        });
      }

      user.name = name ?? user.name;
      user.email = email ?? user.email;
      user.role = role ?? user.role;

      await user.save({ validateModifiedOnly: true });

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
