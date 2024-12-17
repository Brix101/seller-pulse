import { Module } from '@nestjs/common';
import { MarketplaceRepository } from './marketplace.repository';
import { MarketplaceService } from './marketplace.service';

@Module({
  providers: [MarketplaceService, MarketplaceRepository],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
