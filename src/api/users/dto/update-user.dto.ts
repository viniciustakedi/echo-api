import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ERole } from "src/models/roles";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsArray()
  @IsOptional()
  @IsEnum(ERole, { each: true }) // Adicionado IsEnum para verificar cada valor no array
  roles: ERole[];
}
