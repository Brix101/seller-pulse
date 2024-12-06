import { Test, TestingModule } from '@nestjs/testing';
import { LwaService } from './lwa.service';

describe('LwaService', () => {
  let service: LwaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LwaService],
    }).compile();

    service = module.get<LwaService>(LwaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
