import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from 'src/api/projects/projects.service';
import { ProjectsController } from 'src/api/projects/projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/api/projects/schemas/projects.schema';
import { Device, DeviceSchema } from 'src/api/devices/schemas/devices.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      {
        name: Device.name,
        schema: DeviceSchema,
      },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
