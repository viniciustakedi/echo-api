import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

import { ReviewsSchema } from 'src/schemas/reviews.schema';
import { UsersSchema } from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Reviews', schema: ReviewsSchema },
      { name: 'Users', schema: UsersSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
