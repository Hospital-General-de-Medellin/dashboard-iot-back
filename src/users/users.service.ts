import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create({ email, name, password, role }: CreateUserDto) {
    try {
      const user = new this.userModel({ email, name, password, role });

      return await user.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el usuario: ${error.message}`,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      const userFound = await this.userModel.findOne({ email }).exec();

      return userFound;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el usuario: ${error.message}`,
      );
    }
  }
}
