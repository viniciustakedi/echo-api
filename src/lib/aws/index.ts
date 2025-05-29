import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { compressAndConvertImage, editFileName, fileExtension } from './utils';
import { awsEnv } from 'src/infra/env/aws';

const s3 = new S3();

interface IUploadImageS3 {
  file: {
    buffer: Buffer<ArrayBufferLike>;
    filename: string;
  };
  ACL:
  | 'private'
  | 'public-read'
  | 'public-read-write'
  | 'authenticated-read'
  | 'aws-exec-read'
  | 'bucket-owner-read'
  | 'bucket-owner-full-control';
  keyPath?: string;
  contentType?: string;
}

interface IDeleteFileS3 {
  key: any;
  keyPath?: string;
}

export const uploadImageS3 = async (config: IUploadImageS3) => {
  const { file, keyPath, contentType, ACL } = config;
  try {
    const compressedImage = await compressAndConvertImage(file);

    const uploadResult = await s3
      .upload({
        ACL,
        ContentType:
          contentType || `image/${fileExtension(compressedImage.filename)}`,
        Bucket: awsEnv.publicBucketName,
        Body: compressedImage.buffer,
        Key: keyPath
          ? `${keyPath}/${editFileName(compressedImage.filename)}`
          : `reviews/${editFileName(compressedImage.filename)}`,
      })
      .promise();

    return uploadResult;
  } catch (error) {
    throw new HttpException(
      'Failed to upload image to S3: ' + error.message,
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const deleteFileS3 = async (config: IDeleteFileS3) => {
  const { key } = config;
  try {
    await s3
      .deleteObject({
        Bucket: awsEnv.publicBucketName,
        Key: key,
      })
      .promise();
  } catch (error) {
    throw new BadRequestException(error, 'Error to delete image from S3.');
  }
};
