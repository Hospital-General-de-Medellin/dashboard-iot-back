import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from 'src/api/users/users.service';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  async findUser(@Query('email') email?: string, @Query('id') id?: string) {
    return await this.usersService.findUser(id, email);
  }
}
