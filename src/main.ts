import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const back = await NestFactory.create(AppModule);

  back.enableCors();
  back.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await back.listen(3000);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        username: 'hgm-maga@ttn',
        password:
          'NNSXS.BUQAAO3FG77GWDTX6DHADX5FM6WNHMDRRSUIWIY.JH25PY3RE6FDWC4WMXOA5RC5YBK2RYQFBW5E52TZYSDHXI32LR7A',
        url: 'mqtt://nam1.cloud.thethings.network:1883',
      },
    },
  );
  await app.listen();
}
bootstrap();
