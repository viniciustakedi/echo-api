import { Controller, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { LoginUserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @UsePipes(new ValidationPipe())
  async login(@Body() payload: LoginUserDto) {
    return this.authService.userLogin(payload);
  }
}