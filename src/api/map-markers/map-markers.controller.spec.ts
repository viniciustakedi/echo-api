import { Test, TestingModule } from '@nestjs/testing';
import { MapMarkersController } from './map-markers.controller';
import { MapMarkersService } from './map-markers.service';

describe('MapMarkersController', () => {
  let controller: MapMarkersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapMarkersController],
      providers: [MapMarkersService],
    }).compile();

    controller = module.get<MapMarkersController>(MapMarkersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
