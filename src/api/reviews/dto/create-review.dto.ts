import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  headline: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsArray()
  @IsNotEmpty()
  tags: Types.ObjectId[];
}
