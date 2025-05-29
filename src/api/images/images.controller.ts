import { FilesInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UploadedFiles,
  UseInterceptors,
  Delete,
  Param,
  BadGatewayException,
} from '@nestjs/common';

import { imageFileFilter } from 'src/utils/images';
import { ERole } from 'src/models/roles';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @UseInterceptors(
    FilesInterceptor('image', 1, { fileFilter: imageFileFilter }),
  )
  @Post()
  upload(@UploadedFiles() file: Array<Express.Multer.File>) {
    const image = [];

    if (!file || !file.length) {
      throw new BadGatewayException('Image is required!');
    }

    file.forEach((e) => {
      image.push({
        buffer: e.buffer,
        filename: e.originalname,
      });
    });

    return this.imagesService.upload(image[0]);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Delete(':id')
  deleteImage(@Param('id') id: string) {
    return this.imagesService.delete(id);
  }
}
