import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ERole } from "src/models/roles";

export class CreateUserDto {
  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsNotEmpty()
  @IsEnum(ERole, { each: true }) // Adicionado IsEnum para verificar cada valor no array
  roles: ERole[];
}
