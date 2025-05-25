import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';

import { MapMarkersSchema } from 'src/schemas';

import { MapMarkersService } from './map-markers.service';
import { MapMarkersController } from './map-markers.controller';
import { ReviewsModule } from '../reviews/reviews.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/roles/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MapMarkers', schema: MapMarkersSchema },
    ]),
    forwardRef(() => ReviewsModule),
  ],
  controllers: [MapMarkersController],
  providers: [MapMarkersService, { provide: APP_GUARD, useClass: RolesGuard }],
  exports: [MapMarkersService],
})
export class MapMarkersModule {}
