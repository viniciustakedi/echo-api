import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { UsersSchema } from 'src/schemas';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { RolesGuard } from '../auth/roles/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, { provide: APP_GUARD, useClass: RolesGuard }],
  exports: [UsersService],
})
export class UsersModule {}
