import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AuthModule, UsersModule } from 'src/api/module-exporter';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { mongoEnv } from './infra/env';
import { ReviewsModule } from './api/reviews/reviews.module';
import { TagsModule } from './api/tags/tags.module';
import { MapMarkersModule } from './api/map-markers/map-markers.module';

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
    TagsModule,
    MapMarkersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
