import { PartialType } from '@nestjs/mapped-types';
import { CreateMapMarkerDto } from './create-map-marker.dto';

export class UpdateMapMarkerDto extends PartialType(CreateMapMarkerDto) {}
