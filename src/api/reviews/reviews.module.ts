import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

import { ReviewsSchema } from 'src/schemas/reviews.schema';
import { UsersSchema } from 'src/schemas';
import { ReviewsTaggedsSchema } from 'src/schemas/reviews-tagged.schema';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ReviewsTaggeds', schema: ReviewsTaggedsSchema },
      { name: 'Reviews', schema: ReviewsSchema },
      { name: 'Users', schema: UsersSchema },
    ]),
    TagsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
