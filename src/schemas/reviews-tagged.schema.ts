import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

export type TagsDocument = HydratedDocument<Tags>;

@Schema()
export class Tags extends Document {
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

export const TagsSchema = SchemaFactory.createForClass(Tags);
