import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

import { RolesGuard } from '../auth/roles/roles.guard';

import { TagsSchema } from 'src/schemas/tags.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tags', schema: TagsSchema }])],
  controllers: [TagsController],
  providers: [TagsService, { provide: APP_GUARD, useClass: RolesGuard }],
  exports: [TagsService],
})
export class TagsModule {}
