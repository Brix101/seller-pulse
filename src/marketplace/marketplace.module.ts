import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Marketplace } from './entities/marketplace.entity';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceScheduler } from './marketplace.schduler';

@Module({
  imports: [MikroOrmModule.forFeature([Marketplace])],
  providers: [MarketplaceService, MarketplaceScheduler],
})
export class MarketplaceModule {}
