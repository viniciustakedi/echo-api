import { Test, TestingModule } from '@nestjs/testing';
import { MapMarkersService } from './map-markers.service';

describe('MapMarkersService', () => {
  let service: MapMarkersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapMarkersService],
    }).compile();

    service = module.get<MapMarkersService>(MapMarkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
