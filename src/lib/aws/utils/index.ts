import { randomUUID } from 'crypto';
import { extname } from 'path';
import * as sharp from 'sharp';

export const editFileName = (originalName: any) => {
  const name = originalName.split('.')[0];
  const fileExtName = extname(originalName);
  const randomName = randomUUID();

  return `${name}-${randomName}${fileExtName}`;
};

export const fileExtension = (file: string) => {
  return file.split('.').reverse()[0];
};

export async function compressAndConvertImage(
  file: {
    buffer: Buffer<ArrayBufferLike>;
    filename: string;
  },
  size?: number,
) {
  const filenameWithoutSpace = file.filename.toString().replaceAll(' ', '_');
  const newFilename = filenameWithoutSpace.split('.')[0] + '.webp';

  const compressor = await sharp(file.buffer)
    .resize(size)
    .toFormat('webp')
    .webp({
      quality: 75,
    })
    .toBuffer();

  return { buffer: compressor, filename: newFilename };
}
