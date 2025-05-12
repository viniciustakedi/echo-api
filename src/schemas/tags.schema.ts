import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';

export type TagsDocument = HydratedDocument<Tags>;

@Schema()
export class Tags extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: Date,
    default: null,
  })
  updatedAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);

// TagsSchema.index({ name: 1 }, { unique: true });