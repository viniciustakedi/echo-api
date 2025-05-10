import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';

export type TagsDocument = HydratedDocument<Tags>;

@Schema()
export class Tags extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

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

export const TagsSchema = SchemaFactory.createForClass(Tags);
