import { InjectModel } from '@nestjs/mongoose';
import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';

import { isUserAdmin, parseJwt } from 'src/utils';
import { Users } from 'src/schemas';
import {
  dataResponse,
  textResponse,
  generateCode,
  hashPassword,
} from 'src/utils';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<Users>,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async create(payload: CreateUserDto, auth: string) {
    try {
      const { password, roles, ...rest } = payload;

      const isNewUserAdmin = roles.find((role) => role === 'admin');

      if (isNewUserAdmin) {
        if (!auth || !isUserAdmin(auth)) {
          throw new HttpException(
            'You are not authorized to create an admin user.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      let code = generateCode();
      let codeExists = true;

      while (codeExists) {
        const findCode = await this.userModel.findOne({ code }).exec();
        if (!findCode) {
          codeExists = false;
        } else {
          code = generateCode();
        }
      }

      const hashedPassword = await hashPassword(password);

      const newUser = new this.userModel({
        ...rest,
        roles,
        password: hashedPassword,
        code,
      });

      await newUser.save();

      return textResponse('User created successfully!', HttpStatus.CREATED);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  @HttpCode(HttpStatus.OK)
  async findOne(id: string) {
    try {
      const user = await this.userModel
        .findById(id)
        .where('isDeleted')
        .equals(false)
        .select('-password -isDeleted -createdAt -__v')
        .exec();

      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }

      return dataResponse(user, 1, 'User found!', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  async update(id: string, payload: UpdateUserDto) {
    try {
      const user = await this.userModel
        .findById(id)
        .where('isDeleted')
        .equals(false)
        .exec();

      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }

      const { password, ...rest } = payload;

      const dataUpdated: Record<string, any> = {
        ...rest,
        updatedAt: dayjs().toDate(),
      };

      if (password) {
        const hashedPassword = await hashPassword(password);
        dataUpdated.password = hashedPassword;
      }

      await this.userModel
        .updateOne(
          {
            _id: id,
          },
          dataUpdated,
        )
        .exec();

      return textResponse('User updated successfully!', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
