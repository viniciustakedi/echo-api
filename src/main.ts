import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { config } from 'dotenv';

import { AppModule } from 'src/app.module';
import { apiEnv } from './infra/env';

async function bootstrap() {
  config();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(apiEnv.port || 3000, '0.0.0.0');

  console.log(
    `${apiEnv.nodeEnvMessage} - Environment: ${apiEnv.environment} - Port: ${apiEnv.port}`,
  );
}
bootstrap();
