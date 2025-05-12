import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { MapMarkersSchema } from 'src/schemas';

import { MapMarkersService } from './map-markers.service';
import { MapMarkersController } from './map-markers.controller';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MapMarkers', schema: MapMarkersSchema },
    ]),
    ReviewsModule,
  ],
  controllers: [MapMarkersController],
  providers: [MapMarkersService],
  exports: [MapMarkersService],
})
export class MapMarkersModule {}
