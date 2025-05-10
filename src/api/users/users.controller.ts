import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ERole } from 'src/models/roles';
import { isSameUser } from 'src/utils';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Post()
  create(
    @Headers('Authorization') auth: string,
    @Body() payload: CreateUserDto,
  ) {
    return this.usersService.create(payload, auth);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Headers('Authorization') auth: string, @Param('id') id: string) {
    if (!isSameUser(id, auth)) {
      throw new HttpException('Error at find user', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Headers('Authorization') auth: string,
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ) {
    if (!isSameUser(id, auth)) {
      throw new HttpException('Error at find user', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.update(id, payload);
  }
}
