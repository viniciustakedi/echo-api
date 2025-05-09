import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

export type ReviewsDocument = HydratedDocument<Reviews>;

@Schema()
export class Reviews extends Document {
  @Prop({
    type: String,
    required: true,
  })
  thumbnail: string;

  @Prop({
    type: String,
    required: true,
  })
  headline: string;

  @Prop({
    type: String,
    required: true,
  })
  friendlyUrl: string;

  @Prop({
    type: String,
    required: true,
  })
  content: string; // String is a suitable type for storing markdown content as it is plain text.

  @Prop({
    type: Number,
    required: true,
  })
  claps: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  })
  createdBy: mongoose.Schema.Types.ObjectId;

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

export const ReviewsSchema = SchemaFactory.createForClass(Reviews);
