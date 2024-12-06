import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Marketplace } from './entities/marketplace.entity';
import { MarketplaceService } from './marketplace.service';

@Module({
  imports: [MikroOrmModule.forFeature([Marketplace])],
  providers: [MarketplaceService],
})
export class MarketplaceModule {}
