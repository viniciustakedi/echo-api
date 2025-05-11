import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  headline?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsArray()
  @IsOptional()
  tags?: Types.ObjectId[];
}
