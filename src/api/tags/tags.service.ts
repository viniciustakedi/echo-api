import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

import { Tags } from 'src/schemas/tags.schema';
import {
  dataResponse,
  dataResponseWithPagination,
  IDataResponse,
  IDataResponseWithPagination,
  ITextResponse,
  textResponse,
} from 'src/utils';

import { TagsNamespace } from './types';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tags.name)
    private readonly tagsModel: Model<Tags>,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async create(payload: CreateTagDto): Promise<IDataResponse | ITextResponse> {
    const existingTag = await this.tagsModel.findOne({ name: payload.name });

    if (existingTag) {
      throw new BadRequestException('Tag already exists');
    }

    const newTag = new this.tagsModel({
      ...payload,
    });

    const newTagQueryResponse = await newTag.save();
    return dataResponse(
      {
        _id: newTagQueryResponse._id,
      },
      1,
      'Tag created successfully',
      HttpStatus.CREATED,
    );
  }

  @HttpCode(HttpStatus.OK)
  async findAll(
    filters: TagsNamespace.GetTagsFilter,
  ): Promise<IDataResponseWithPagination | ITextResponse> {
    let { name, limit, page, orderBy } = filters;

    if (!limit || limit > 15) {
      limit = 15;
    }

    if (!page) {
      page = 1;
    }

    const queryFilters = {};
    if (name) {
      queryFilters['name'] = { $regex: name, $options: 'i' };
    }

    const tags = await this.tagsModel
      .find(queryFilters, '-updatedAt -__v')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: orderBy == 'asc' ? 1 : -1 })
      .exec();

    if (!tags || tags.length === 0) {
      throw new HttpException('No tags found', HttpStatus.NOT_FOUND);
    }

    const total = await this.tagsModel.countDocuments(queryFilters);

    return dataResponseWithPagination(
      tags,
      total,
      limit,
      page,
      'Tags fetched successfully',
      HttpStatus.OK,
    );
  }

  @HttpCode(HttpStatus.OK)
  async checkIfTagsExists(
    id: Types.ObjectId | Types.ObjectId[],
    multiple: boolean,
  ): Promise<IDataResponseWithPagination | ITextResponse> {
    if (multiple) {
      if (!Array.isArray(id)) {
        throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
      }

      const tags = await this.tagsModel
        .find(
          {
            _id: {
              $in: id,
            },
          },
          '_id',
        )
        .exec();

      if (!tags || tags.length === 0) {
        throw new HttpException('No tags found', HttpStatus.NOT_FOUND);
      }

      const foundTagsIds = tags.map((tag) => tag._id.toString());
      const notFoundTagsIds = id
        .map((tag) => tag.toString())
        .filter((tagId) => !foundTagsIds.includes(tagId));

      if (notFoundTagsIds.length > 0) {
        throw new HttpException(
          `Tags with ids ${notFoundTagsIds.join(', ')} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return dataResponse(
        tags,
        tags.length,
        'Tags fetched successfully',
        HttpStatus.OK,
      );
    }

    const tag = await this.tagsModel
      .findOne({ _id: id }, '-updatedAt -__v')
      .exec();

    if (!tag) {
      throw new HttpException('No tag found', HttpStatus.NOT_FOUND);
    }

    return dataResponse(tag, 1, 'Tags fetched successfully', HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  async update(id: string, payload: UpdateTagDto): Promise<ITextResponse> {
    const tag = await this.tagsModel.findById(id);

    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }

    const updatedTag = await this.tagsModel.findByIdAndUpdate(
      id,
      { ...payload },
      { new: true },
    );

    if (!updatedTag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }

    return textResponse('Tag updated successfully', HttpStatus.OK);
  }
}
