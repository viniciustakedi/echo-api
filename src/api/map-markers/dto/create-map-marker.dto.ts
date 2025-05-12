import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMapMarkerDto {
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @IsNotEmpty()
  longitude: string;

  @IsString()
  @IsNotEmpty() 
  reviewId: string;
}
