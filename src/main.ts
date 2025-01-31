import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(app.get(Logger));

  app.enableCors({
    origin: 'http://localhost:5173', // Allow Vite frontend
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
