import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

export type MapMarkersDocument = HydratedDocument<MapMarkers>;

@Schema()
export class MapMarkers extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviews',
  })
  reviewId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  latitude: string;

  @Prop({
    type: String,
    required: true,
  })
  longitude: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;
}

export const MapMarkersSchema = SchemaFactory.createForClass(MapMarkers);


MapMarkersSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

MapMarkersSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

MapMarkersSchema.pre('findOneAndUpdate', function () {
  this.where({ isDeleted: false });
});

MapMarkersSchema.pre('countDocuments', function () {
  this.where({ isDeleted: false });
});

MapMarkersSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: false } });
});
