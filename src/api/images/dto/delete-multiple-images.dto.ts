import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class DeleteMultipleImagesDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  ids: string[];
}
