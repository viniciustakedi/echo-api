import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import * as dayjs from 'dayjs';

import {
  dataResponse,
  dataResponseWithPagination,
  generateCode,
  IDataResponse,
  IDataResponseWithPagination,
  isSameUser,
  ITextResponse,
  parseJwt,
  textResponse,
} from 'src/utils';
import { Reviews } from 'src/schemas/reviews.schema';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsNamespace } from './types';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Reviews.name)
    private readonly reviewsModel: Model<Reviews>,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createReview(payload: CreateReviewDto, auth: string) {
    const userId = parseJwt(auth).sub;

    const reviewCode = generateCode();
    const friendlyUrl = `${payload.headline.toLowerCase().replaceAll(' ', '-')}-${reviewCode}`;

    const newReviewPost = new this.reviewsModel({
      ...payload,
      friendlyUrl,
      createdBy: userId,
      claps: 0,
    });
    await newReviewPost.save();

    return dataResponse(
      {
        friendlyUrl,
        createdAt: dayjs().format('YYYY-MM-DD'),
      },
      1,
      'Review created successfully',
      HttpStatus.CREATED,
    );
  }

  @HttpCode(HttpStatus.OK)
  async findAll(
    filters: ReviewsNamespace.GetReviewsFilters,
  ): Promise<IDataResponseWithPagination | ITextResponse> {
    let { rating, tags, limit, page, sort } = filters;

    if (!limit || limit > 15) {
      limit = 15;
    }

    if (!page) {
      page = 1;
    }

    const queryFilters = { isDeleted: false };

    if (rating) {
      queryFilters['rating'] = { $gte: rating };
    }

    const reviews = await this.reviewsModel
      .find(queryFilters, '-createdBy -__v -isDeleted')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    if (!reviews || reviews.length === 0) {
      throw new HttpException('No reviews found', HttpStatus.NOT_FOUND);
    }

    const total = await this.reviewsModel.countDocuments(queryFilters);

    return dataResponseWithPagination(
      reviews,
      total,
      page,
      limit,
      'Reviews found successfully',
      HttpStatus.OK,
    );
  }

  @HttpCode(HttpStatus.OK)
  async findOne(
    key: string,
    fields?: string,
  ): Promise<IDataResponse | ITextResponse> {
    let keyToFind: string | Types.ObjectId = key;
    let keyType: ReviewsNamespace.EReviewKeyTypes =
      ReviewsNamespace.EReviewKeyTypes.friendlyUrl;

    if (Types.ObjectId.isValid(key)) {
      keyToFind = new Types.ObjectId(key);
      keyType = ReviewsNamespace.EReviewKeyTypes.id;
    }

    const review = await this.reviewsModel
      .findOne(
        { [keyType]: keyToFind, isDeleted: false },
        fields ?? '-createdBy -__v -isDeleted',
      )
      .exec();

    if (!review) {
      return textResponse('Review not found', HttpStatus.NOT_FOUND);
    }

    let reviewResponse: ReviewsNamespace.FindOneDBResponse = {
      ...(review.toObject() as ReviewsNamespace.FindOneDBResponse),
    };

    if (fields) {
      reviewResponse = {
        ...(review.toObject() as ReviewsNamespace.FindOneDBResponse),
        keyType,
        keyUsed: keyToFind,
      };
    }

    return dataResponse(
      reviewResponse,
      1,
      'Review found successfully',
      HttpStatus.OK,
    );
  }

  @HttpCode(HttpStatus.OK)
  async updateReview(
    key: string,
    payload: UpdateReviewDto,
    auth: string,
  ): Promise<ITextResponse> {
    const review = await this.findOne(key, 'createdBy');
    if (review.statusCode !== HttpStatus.OK || !('data' in review)) {
      return review;
    }

    const updatedBySameUser = isSameUser(
      review.data.createdBy.toString(),
      auth,
    );

    if (!updatedBySameUser) {
      return textResponse(
        'You are not allowed to update this review',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.reviewsModel
      .findOneAndUpdate(
        { [review.data.keyType]: review.data.keyUsed },
        {
          ...payload,
          updatedAt: dayjs().format('YYYY-MM-DD'),
        },
        { new: true },
      )
      .exec();

    return textResponse('Review updated successfully', HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  async softDeleteReview(key: string, auth: string): Promise<ITextResponse> {
    const review = await this.findOne(key, 'createdBy');
    if (review.statusCode !== HttpStatus.OK || !('data' in review)) {
      return review;
    }

    const deletedBySameUser = isSameUser(
      review.data.createdBy.toString(),
      auth,
    );

    if (!deletedBySameUser) {
      return textResponse(
        'You are not allowed to delete this review',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.reviewsModel
      .findOneAndUpdate(
        { [review.data.keyType]: review.data.keyUsed },
        {
          isDeleted: true,
          updatedAt: dayjs().format('YYYY-MM-DD'),
        },
        { new: true },
      )
      .exec();

    return textResponse('Review deleted successfully', HttpStatus.OK);
  }
}
