import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'dotenv';

async function bootstrap() {
  config();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  
  app.setGlobalPrefix("api")
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  console.log(
    '🚀 ~ ENV ~ environment message ~ 🚀',
    process.env.NODE_ENV_MESSAGE,
    '🚀',
    `Run on port ${process.env.PORT}`,
    '🚀',
  );
}
bootstrap();