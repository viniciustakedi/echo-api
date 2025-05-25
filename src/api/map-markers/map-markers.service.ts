import {
  BadRequestException,
  forwardRef,
  HttpCode,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateMapMarkerDto } from './dto/create-map-marker.dto';
import { UpdateMapMarkerDto } from './dto/update-map-marker.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MapMarkers } from 'src/schemas';
import { Model } from 'mongoose';
import { ReviewsService } from '../reviews/reviews.service';
import {
  dataResponse,
  dataResponseWithPagination,
  IDataResponse,
  IDataResponseWithPagination,
  ITextResponse,
  textResponse,
} from 'src/utils';
import { MapMarkersNamespace } from './types';

@Injectable()
export class MapMarkersService {
  constructor(
    @InjectModel(MapMarkers.name)
    private readonly mapMarkersModel: Model<MapMarkers>,

    @Inject(forwardRef(() => ReviewsService))
    private readonly reviewsService: ReviewsService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createMarker(payload: CreateMapMarkerDto): Promise<ITextResponse> {
    const review = await this.reviewsService.findOne(payload.reviewId, '_id');

    if (review.statusCode !== HttpStatus.OK) {
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Review not found to link to map marker.',
      });
    }

    const newMapMarker = new this.mapMarkersModel({
      ...payload,
    });

    const savedMapMarker = await newMapMarker.save();

    if (!savedMapMarker) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating map marker',
      };
    }

    return textResponse('Map marker created successfully', HttpStatus.CREATED);
  }

  @HttpCode(HttpStatus.OK)
  async findAll(
    filters: MapMarkersNamespace.GetMapMarkersFilters,
  ): Promise<ITextResponse | IDataResponseWithPagination> {
    const { page, limit } = filters;
    const skip = (page - 1) * limit;

    const mapMarkers = this.mapMarkersModel
      .find(
        {},
        {
          reviewId: 1,
          latitude: 1,
          longitude: 1,
        },
      )
      .skip(skip)
      .limit(limit)
      .populate('reviewId', 'thumbnail headline _id')
      .exec();

    const total = this.mapMarkersModel.countDocuments();
    const mapMarkersWithPagination = await Promise.all([mapMarkers, total]);

    if (!mapMarkersWithPagination) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error fetching map markers',
      });
    }

    const response = mapMarkersWithPagination[0].map((marker) => {
      const markerObject = marker.toObject();
      const { reviewId, ...rest } = markerObject;

      return {
        ...rest,
        review: reviewId,
      };
    });

    return dataResponseWithPagination(
      response,
      mapMarkersWithPagination[1],
      page,
      limit,
      'Map markers fetched successfully',
      HttpStatus.OK,
    );
  }

  @HttpCode(HttpStatus.OK)
  async findById(
    id: string,
    fields?: string,
  ): Promise<ITextResponse | IDataResponse> {
    const mapMarker = await this.mapMarkersModel
      .findById(id, fields || '-__v')
      .exec();

    if (!mapMarker) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Map marker not found',
      });
    }

    const review = await this.reviewsService.findOne(
      mapMarker.reviewId.toString(),
      '_id thumbnail headline friendlyUrl rating priceRating tags.name address city country',
    );

    if (review.statusCode !== HttpStatus.OK || !('data' in review)) {
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Review not found',
      });
    }

    const { reviewId, ...rest } = mapMarker.toObject();

    const response = {
      ...rest,
      review: review.data,
    };

    return dataResponse(
      response,
      1,
      'Map marker fetched successfully',
      HttpStatus.OK,
    );
  }

  @HttpCode(HttpStatus.OK)
  async updateMarker(
    id: string,
    payload: UpdateMapMarkerDto,
  ): Promise<ITextResponse | IDataResponse> {
    const mapMarker = await this.mapMarkersModel.findById(id, '_id').exec();
    if (!mapMarker) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Map marker not found',
      });
    }

    const updatedMapMarker = await this.mapMarkersModel
      .findByIdAndUpdate(id, { ...payload }, { new: true })
      .populate('reviewId', 'thumbnail headline _id')
      .exec();
    if (!updatedMapMarker) {
      throw new BadRequestException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error updating map marker',
      });
    }

    return textResponse('Map marker updated successfully', HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  async remove(id: string): Promise<ITextResponse> {
    const mapMarker = await this.mapMarkersModel.findById(id).exec();
    if (!mapMarker) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Map marker not found',
      });
    }

    const deletedMapMarker = await this.mapMarkersModel
      .updateOne({ _id: id }, { isDeleted: true })
      .exec();

    if (!deletedMapMarker) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error deleting map marker',
      });
    }

    return textResponse('Map marker deleted successfully', HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  async findByReviewId({
    id,
    fields,
    noException,
  }: {
    id: string;
    fields?: string;
    noException?: boolean;
  }): Promise<ITextResponse | IDataResponse> {
    const mapMarker = await this.mapMarkersModel
      .findOne({ reviewId: id }, fields || '-__v')
      .exec();

    if (!mapMarker && noException) {
      return textResponse('Map marker not found', HttpStatus.BAD_REQUEST);
    }

    if (!mapMarker && !noException) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Map marker not found',
      });
    }

    return dataResponse(
      mapMarker,
      1,
      'Map marker fetched successfully',
      HttpStatus.OK,
    );
  }
}
