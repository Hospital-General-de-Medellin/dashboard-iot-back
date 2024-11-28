import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/api/users/users.service';
import { RegisterDto } from 'src/api/auth/dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from 'src/api/auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password, name, role }: RegisterDto) {
    try {
      const user = await this.usersService.findUserByEmail(email);

      if (user) {
        throw new BadRequestException('El usuario ya existe');
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      await this.usersService.createUser({
        name,
        email,
        password: hashedPassword,
        role,
      });

      return {
        message: 'Usuario creado correctamente',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al crear el usuario: ${error.message}`,
      );
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.usersService.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Credenciales invalidas');
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales invalidas');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };

      const token = await this.jwtService.signAsync(payload);

      return {
        token: token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al iniciar sesion: ${error.message}`,
      );
    }
  }
}
