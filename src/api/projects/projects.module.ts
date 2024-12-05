import { Module } from '@nestjs/common';
import { ProjectsService } from 'src/api/projects/projects.service';
import { ProjectsController } from 'src/api/projects/projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/api/projects/schemas/projects.schema';
import { Device, DeviceSchema } from 'src/api/devices/schemas/devices.schema';
import { User, userSchema } from 'src/api/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      {
        name: Device.name,
        schema: DeviceSchema,
      },
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
