import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

import { ReviewsSchema } from 'src/schemas/reviews.schema';
import { UsersSchema } from 'src/schemas';
import { ReviewsTaggedsSchema } from 'src/schemas/reviews-tagged.schema';

import { MapMarkersModule } from '../map-markers/map-markers.module';
import { TagsModule } from '../tags/tags.module';
import { RolesGuard } from '../auth/roles/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ReviewsTaggeds', schema: ReviewsTaggedsSchema },
      { name: 'Reviews', schema: ReviewsSchema },
      { name: 'Users', schema: UsersSchema },
    ]),
    TagsModule,
    forwardRef(() => MapMarkersModule),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, { provide: APP_GUARD, useClass: RolesGuard }],
  exports: [ReviewsService],
})
export class ReviewsModule {}
