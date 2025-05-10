import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

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
}
