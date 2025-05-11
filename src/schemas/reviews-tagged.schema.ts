import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

export type ReviewsTaggedsDocument = HydratedDocument<ReviewsTaggeds>;

@Schema()
export class ReviewsTaggeds extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviews',
  })
  reviewId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tags',
  })
  tagId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

export const ReviewsTaggedsSchema =
  SchemaFactory.createForClass(ReviewsTaggeds);
