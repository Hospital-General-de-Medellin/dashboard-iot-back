import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceModule } from 'src/api/devices/devices.module';
import { ProjectsModule } from 'src/api/projects/projects.module';
import { AuthModule } from 'src/api/auth/auth.module';
import { UsersModule } from 'src/api/users/users.module';
import { LocationsModule } from 'src/api/locations/locations.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:example@localhost:28018/'), // URL de tu base de datos
    DeviceModule,
    ProjectsModule,
    AuthModule,
    UsersModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
