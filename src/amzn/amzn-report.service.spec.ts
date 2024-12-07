import { Test, TestingModule } from '@nestjs/testing';
import { AmznReportService } from './amzn-report.service';

describe('AmznService', () => {
  let service: AmznReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmznReportService],
    }).compile();

    service = module.get<AmznReportService>(AmznReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
