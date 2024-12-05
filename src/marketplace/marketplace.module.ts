import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Marketplace } from './entities/marketplace.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Marketplace])],
})
export class MarketplaceModule {}
