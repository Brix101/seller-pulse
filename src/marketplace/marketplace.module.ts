import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AmznModule } from 'src/amzn/amzn.module';
import { Marketplace } from './entities/marketplace.entity';
import { MarketplaceService } from './marketplace.service';

@Module({
  imports: [MikroOrmModule.forFeature([Marketplace]), AmznModule],
  providers: [MarketplaceService],
})
export class MarketplaceModule {}
