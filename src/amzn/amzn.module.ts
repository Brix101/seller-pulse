import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { AmznMarketplaceService } from './amzn-marketplace.service';
import { AmznReportService } from './amzn-report.service';
import { LwaService } from './lwa.service';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [LwaService, AmznMarketplaceService, AmznReportService],
  exports: [AmznMarketplaceService, AmznReportService],
})
export class AmznModule {}
