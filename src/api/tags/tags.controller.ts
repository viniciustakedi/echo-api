import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';

import { ERole } from 'src/models/roles';

import { TagsService } from './tags.service';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

import { Roles } from '../auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { TagsNamespace } from './types';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Post()
  create(@Body() paylod: CreateTagDto) {
    return this.tagsService.create(paylod);
  }

  @Get()
  findAll(@Query() filters: TagsNamespace.GetTagsFilter) {
    return this.tagsService.findAll(filters);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateTagDto) {
    return this.tagsService.update(id, payload);
  }
}
