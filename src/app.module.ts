import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AuthModule, UsersModule } from 'src/api/module-exporter';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { mongoEnv } from './infra/env';
import { ReviewsModule } from './api/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(mongoEnv.uri, {
      dbName: mongoEnv.database,
    }),
    AuthModule,
    UsersModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
