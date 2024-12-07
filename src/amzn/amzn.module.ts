import { Module } from '@nestjs/common';
import { AmznMarketplaceService } from './amzn-marketplace.service';
import { HttpModule } from '@nestjs/axios';
import { LwaModule } from 'src/lwa/lwa.module';
import { AmznReportService } from './amzn-report.service';

@Module({
  imports: [HttpModule, LwaModule],
  providers: [AmznMarketplaceService, AmznReportService],
  exports: [AmznMarketplaceService, AmznReportService],
})
export class AmznModule {}
