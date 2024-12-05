import { Module } from '@nestjs/common';
import { UsersService } from 'src/api/users/users.service';
import { UsersController } from 'src/api/users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/api/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
