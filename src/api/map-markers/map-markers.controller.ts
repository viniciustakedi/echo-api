import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';

import { MapMarkersService } from './map-markers.service';

import { CreateMapMarkerDto } from './dto/create-map-marker.dto';
import { UpdateMapMarkerDto } from './dto/update-map-marker.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

import { ERole } from 'src/models/roles';
import { MapMarkersNamespace } from './types';

@Controller('map-markers')
export class MapMarkersController {
  constructor(private readonly mapMarkersService: MapMarkersService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Post()
  createMarker(@Body() payload: CreateMapMarkerDto) {
    return this.mapMarkersService.createMarker(payload);
  }

  @Get()
  findAll(@Query() filters: MapMarkersNamespace.GetMapMarkersFilters) {
    return this.mapMarkersService.findAll(filters);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.mapMarkersService.findById(id);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Patch(':id')
  updateMarker(
    @Param('id') id: string,
    @Body() payload: UpdateMapMarkerDto,
  ) {
    return this.mapMarkersService.updateMarker(id, payload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mapMarkersService.remove(id);
  }
}
