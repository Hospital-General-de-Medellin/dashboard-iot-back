import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/api/users/dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/api/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
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
}
