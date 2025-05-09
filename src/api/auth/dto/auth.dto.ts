import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  login: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

}