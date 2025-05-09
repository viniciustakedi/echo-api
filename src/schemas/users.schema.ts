import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';

import { ERole } from 'src/models/roles';

export type UsersDocument = HydratedDocument<Users>;

function isArrayOfValidEnums(arr: ERole[]): boolean {
  return arr.every((item) => Object.values(ERole).includes(item));
}

@Schema()
export class Users extends Document {
  @Prop({
    type: String,
    required: false,
  })
  avatar: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    length: 6,
  })
  code: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    validate: isArrayOfValidEnums,
  })
  roles: ERole[];

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

export const UsersSchema = SchemaFactory.createForClass(Users);
