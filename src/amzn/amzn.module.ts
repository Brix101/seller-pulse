import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { AmznMarketplaceService } from './amzn-marketplace.service';
import { LwaService } from './lwa.service';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [LwaService, AmznMarketplaceService],
  exports: [AmznMarketplaceService],
})
export class AmznModule {}
