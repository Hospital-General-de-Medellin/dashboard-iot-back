import { Module } from '@nestjs/common';
import { UsersService } from 'src/api/users/users.service';
import { UsersController } from 'src/api/users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/api/users/schemas/user.schema';
import { Project, ProjectSchema } from '../projects/schemas/projects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
