import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

import { ERole } from 'src/models/roles';

import { ReviewsNamespace } from './types';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Post()
  createReview(
    @Headers('Authorization') auth: string,
    @Body() payload: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(payload, auth);
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.reviewsService.findOne(key);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Patch(':key')
  updateReview(
    @Headers('Authorization') auth: string,
    @Param('key') key: string,
    @Body() payload: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(key, payload, auth);
  }

  @Get()
  findAll(@Query() filters: ReviewsNamespace.GetReviewsFilters) {
    return this.reviewsService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Delete(':key')
  softDeleteReview(
    @Headers('Authorization') auth: string,
    @Param('key') key: string,
  ) {
    return this.reviewsService.softDeleteReview(key, auth);
  }
}
