import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ password, email, name }: RegisterDto) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (user) {
        throw new BadRequestException('El usuario ya existe');
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      await this.usersService.create({
        name,
        email,
        password: hashedPassword,
      });

      return {
        message: 'Usuario creado correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error al crear el usuario: ${error.message}`,
      });
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Credenciales invalidas');
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales invalidas');
      }

      const payload = { sub: user.id, email: user.email };

      const token = await this.jwtService.signAsync(payload);

      return {
        token: token,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error al iniciar sesion: ${error.message}`,
      });
    }
  }
}
