import { Test, TestingModule } from '@nestjs/testing';
import { AmznService } from './amzn.service';

describe('AmznService', () => {
  let service: AmznService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmznService],
    }).compile();

    service = module.get<AmznService>(AmznService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
