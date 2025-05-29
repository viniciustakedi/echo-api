import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { RolesGuard } from '../auth/roles/roles.guard';

import { ImagesSchema } from 'src/schemas';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Images', schema: ImagesSchema }]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, { provide: APP_GUARD, useClass: RolesGuard }],
  exports: [ImagesService],
})
export class ImagesModule {}
