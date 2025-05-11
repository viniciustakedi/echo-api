import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

import { Tags } from 'src/schemas/tags.schema';
import {
  dataResponseWithPagination,
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
  async create(payload: CreateTagDto): Promise<ITextResponse> {
    const newTag = new this.tagsModel({
      ...payload,
    });

    await newTag.save();
    return textResponse('Tag created successfully', HttpStatus.CREATED);
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
