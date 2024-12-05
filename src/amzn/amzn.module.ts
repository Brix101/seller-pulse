import { Module } from '@nestjs/common';
import { AmznMarketplaceService } from './amzn-marketplace.service';

@Module({
  providers: [AmznMarketplaceService],
})
export class AmznModule {}
