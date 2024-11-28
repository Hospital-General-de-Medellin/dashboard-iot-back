import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/api/users/users.service';
import { CreateUserDto } from 'src/api/users/dto/create-user.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }
}
