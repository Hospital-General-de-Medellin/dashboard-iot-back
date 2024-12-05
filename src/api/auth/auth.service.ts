import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/api/users/users.service';
import { RegisterDto } from 'src/api/auth/dto/register.dto';
import { LoginDto } from 'src/api/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password, name, role, projects }: RegisterDto) {
    try {
      const user = await this.usersService.findUserByEmail(email);

      if (user) {
        throw new BadRequestException('El usuario ya existe');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.usersService.createUser({
        email,
        name,
        password: hashedPassword,
        role,
        projects,
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

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales invalidas');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };

      const token = await this.jwtService.signAsync(payload);

      return {
        accessToken: token,
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
