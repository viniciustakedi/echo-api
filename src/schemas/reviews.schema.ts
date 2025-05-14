import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isNumber } from 'class-validator';
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
  city: string;

  @Prop({
    type: String,
    required: true,
  })
  country: string;

  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
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
  rating: Number;

  @Prop({
    type: Number,
    required: true,
  })
  priceRating: Number;

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
    default: null,
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

ReviewsSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

ReviewsSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

ReviewsSchema.pre('findOneAndUpdate', function () {
  this.where({ isDeleted: false });
});

ReviewsSchema.pre('countDocuments', function () {
  this.where({ isDeleted: false });
});

ReviewsSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: false } });
});

ReviewsSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// ReviewsSchema.index({ friendlyUrl: 1 }, { unique: true });
// ReviewsSchema.index({ createdAt: -1 });
// ReviewsSchema.index({ updatedAt: -1 });
