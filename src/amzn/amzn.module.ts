import { Module } from '@nestjs/common';
import { AmznMarketplaceService } from './amzn-marketplace.service';
import { HttpModule } from '@nestjs/axios';
import { LwaModule } from 'src/lwa/lwa.module';

@Module({
  imports: [HttpModule, LwaModule],
  providers: [AmznMarketplaceService],
  exports: [AmznMarketplaceService],
})
export class AmznModule {}
