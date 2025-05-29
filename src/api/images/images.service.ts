import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
  async upload(image: {
    buffer: Buffer<ArrayBufferLike>;
    filename: string;
  }): Promise<IDataResponse | ITextResponse> {
    const uploadImageResult = await uploadImageS3({
      file: image,
      ACL: 'public-read',
    });

    const newImage = new this.imagesModel({
      path: uploadImageResult.Location,
      filename: uploadImageResult.Key,
      alt: uploadImageResult.Key.split('.').slice(0, -1).join('.'),
    });

    const newImageQueryResponse = await newImage.save();

    return dataResponse(
      {
        _id: newImageQueryResponse._id,
        url: uploadImageResult.Location,
      },
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
}
