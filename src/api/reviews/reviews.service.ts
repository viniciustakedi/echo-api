import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import * as dayjs from 'dayjs';

import { ReviewsTaggeds } from 'src/schemas/reviews-tagged.schema';
import { Reviews } from 'src/schemas/reviews.schema';
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

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { TagsService } from '../tags/tags.service';
import { ReviewsNamespace } from './types';
import { MapMarkersService } from '../map-markers/map-markers.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Reviews.name)
    private readonly reviewsModel: Model<Reviews>,

    @InjectModel(ReviewsTaggeds.name)
    private readonly reviewsTaggedsModel: Model<ReviewsTaggeds>,

    @Inject(TagsService)
    private readonly tagsService: TagsService,

    @Inject(forwardRef(() => MapMarkersService))
    private readonly mapMarkerService: MapMarkersService,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  async createReview(payload: CreateReviewDto, auth: string) {
    const userId = parseJwt(auth).sub;

    const tags = await this.tagsService.checkIfTagsExists(payload.tags, true);
    if (tags.statusCode !== HttpStatus.OK) {
      return tags;
    }

    const reviewCode = generateCode();
    const friendlyUrl = `${payload.headline.toLowerCase().replaceAll(' ', '-')}-${reviewCode}`;

    const newReviewPost = new this.reviewsModel({
      ...payload,
      friendlyUrl,
      createdBy: userId,
      claps: 0,
    });

    const session = await this.reviewsModel.db.startSession();
    session.startTransaction();

    const newReviewId = (await newReviewPost.save({ session }))._id;

    if (!newReviewId) {
      throw new HttpException(
        'Error creating review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const tagsToInsert = payload.tags.map((tag: Types.ObjectId) => ({
      reviewId: newReviewId,
      tagId: tag,
    }));

    await this.reviewsTaggedsModel.insertMany(tagsToInsert, { session });

    await session.commitTransaction();
    session.endSession();

    return dataResponse(
      {
        _id: newReviewId,
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
      .aggregate([
        { $match: queryFilters },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * Number(limit) },
        { $limit: Number(limit) },
        {
          $lookup: {
            from: 'reviewstaggeds',
            localField: '_id',
            foreignField: 'reviewId',
            as: 'tagsInfo',
          },
        },
        {
          $lookup: {
            from: 'tags',
            localField: 'tagsInfo.tagId',
            foreignField: '_id',
            as: 'tags',
          },
        },
        {
          $project: {
            createdBy: 0,
            content: 0,
            claps: 0,
            updatedAt: 0,
            isDeleted: 0,
            tagsInfo: 0,
            __v: 0,
            'tags.__v': 0,
            'tags.createdAt': 0,
            'tags.updatedAt': 0,
          },
        },
      ])
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
      .aggregate([
        { $match: { [keyType]: keyToFind, isDeleted: false } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'reviewstaggeds',
            localField: '_id',
            foreignField: 'reviewId',
            as: 'tagsInfo',
          },
        },
        {
          $lookup: {
            from: 'tags',
            localField: 'tagsInfo.tagId',
            foreignField: '_id',
            as: 'tags',
          },
        },
        {
          $project: {
            ...(fields
              ? fields.split(' ').reduce((acc, field) => {
                acc[field] = 1;
                return acc;
              }, {})
              : {
                isDeleted: 0,
                tagsInfo: 0,
                __v: 0,
                'tags.__v': 0,
                'tags.createdAt': 0,
                'tags.updatedAt': 0,
              }),
          },
        },
      ])
      .exec();

    if (!review || review.length === 0) {
      throw new BadRequestException('Review not found.');
    }

    let reviewResponse: ReviewsNamespace.FindOneDBResponse = {
      ...(review[0] as ReviewsNamespace.FindOneDBResponse),
    };

    if (fields) {
      reviewResponse = {
        ...(review[0] as ReviewsNamespace.FindOneDBResponse),
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
    const review = await this.findOne(key, 'createdBy _id');
    if (review.statusCode !== HttpStatus.OK || !('data' in review)) {
      return review;
    }

    let tags: string[] = [];
    if (payload.tags) {
      const tagsResponse = await this.tagsService.checkIfTagsExists(
        payload.tags,
        true,
      );

      if (tagsResponse.statusCode !== HttpStatus.OK) {
        return tagsResponse;
      }

      tags = payload.tags.map((tag) => tag.toString());
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

    const session = await this.reviewsModel.db.startSession();
    session.startTransaction();

    await this.reviewsModel
      .updateOne(
        { [review.data.keyType]: review.data.keyUsed },
        {
          ...payload,
          updatedAt: dayjs().format('YYYY-MM-DD'),
        },
        { session, new: true },
      )
      .exec();

    if (tags.length) {
      const allTags = await this.reviewsTaggedsModel
        .find({ reviewId: review.data._id })
        .select('tagId')
        .exec();

      const allTagsMap = allTags.map((tag) => ({
        _id: tag._id,
        tagId: tag.tagId.toString(),
      }));

      const tagsToInsert = tags.filter(
        (tag) => !allTagsMap.some((existingTag) => existingTag.tagId === tag),
      );

      if (tagsToInsert.length) {
        const tagsToInsertData = tagsToInsert.map((tag) => ({
          reviewId: review.data._id,
          tagId: tag,
        }));

        await this.reviewsTaggedsModel.insertMany(tagsToInsertData, {
          session,
        });
      }

      const tagsToDelete = allTagsMap
        .filter((existingTag) => !tags.includes(existingTag.tagId))
        .map((tag) => tag._id);

      if (tagsToDelete.length > 0) {
        await this.reviewsTaggedsModel
          .deleteMany(
            { _id: { $in: tagsToDelete.map((tag) => tag) } },
            { session },
          )
          .exec();
      }
    }

    await session.commitTransaction();
    session.endSession();

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
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    const mapMarker = await this.mapMarkerService.findByReviewId({
      id: review.data._id,
      fields: '_id',
      noException: true,
    });
    if (mapMarker.statusCode === HttpStatus.OK) {
      throw new BadRequestException(
        'A map marker is linked with this review, delete the map marker first, then delete this review.',
      );
    }

    await this.reviewsModel
      .updateOne(
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
