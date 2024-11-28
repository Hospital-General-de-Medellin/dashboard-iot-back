import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/api/users/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
