import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';

export type ImagesDocument = HydratedDocument<Images>;

@Schema()
export class Images extends Document {
  @Prop({
    type: String,
    required: false,
  })
  alt: string;

  @Prop({
    type: String,
    required: true,
  })
  filename: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  path: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

export const ImagesSchema = SchemaFactory.createForClass(Images);
