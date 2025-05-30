import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  dataResponse,
  IDataResponse,
  ITextResponse,
  textResponse,
} from 'src/utils';

import { Images } from 'src/schemas';
import { deleteFileS3, uploadImageS3 } from 'src/lib/aws';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Images.name)
    private readonly imagesModel: Model<Images>,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  async upload(images: {
    buffer: Buffer<ArrayBufferLike>;
    filename: string;
  }[]): Promise<IDataResponse | ITextResponse> {
    const responses = await Promise.all(images.map(async (image) => {
      const uploadImageResult = await uploadImageS3({
        file: image,
        ACL: 'public-read',
      });

      return uploadImageResult;
    }));


    const imagesInserted = await Promise.all(responses.map(async (response) => {
      const newImage = new this.imagesModel({
        path: response.Location,
        filename: response.Key,
        alt: response.Key.split('.').slice(0, -1).join('.'),
      });

      return { _id: (await newImage.save())._id, path: response.Location };
    }));


    let response: { _id: string, url: string } | { _id: string, url: string }[];

    if (imagesInserted.length === 1) {
      response = {
        _id: imagesInserted[0]._id as string,
        url: imagesInserted[0].path,
      }
    } else {
      response = imagesInserted.map((image) => ({
        _id: image._id as string,
        url: image.path,
      }));
    }


    return dataResponse(
      response,
      1,
      'Image created successfully',
      HttpStatus.CREATED,
    );
  }

  @HttpCode(HttpStatus.OK)
  async delete(id: string) {
    try {
      const image = await this.imagesModel.findById(id);
      if (!image) {
        throw new BadRequestException('Error fetching image, image not found!');
      }

      await deleteFileS3({ key: image.filename });
      await this.imagesModel.deleteOne({ _id: id }).exec();

      return textResponse('Image deleted successfully!', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  async deleteMultiple(ids: string[]) {
    try {
      const idsConvertedToObjectId = ids.map((id) => new Types.ObjectId(id));

      const images = await this.imagesModel.find({ _id: { $in: idsConvertedToObjectId } });
      if (images.length !== ids.length) {
        throw new BadRequestException('Error fetching images, some images not found!');
      }

      await Promise.all(images.map(async (image) => {
        await deleteFileS3({ key: image.filename });
      }));

      await this.imagesModel.deleteMany({ _id: { $in: idsConvertedToObjectId } }).exec();

      return textResponse('Image deleted successfully!', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
