import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

import { TagsSchema } from 'src/schemas/tags.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tags', schema: TagsSchema }])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
