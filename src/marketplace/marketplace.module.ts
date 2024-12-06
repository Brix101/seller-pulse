import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { Marketplace } from './entities/marketplace.entity';
import { MarketplaceScheduler } from './marketplace.scheduler';
import { MarketplaceService } from './marketplace.service';

@Module({
  imports: [MikroOrmModule.forFeature([Marketplace]), ClientModule],
  providers: [MarketplaceService, MarketplaceScheduler],
})
export class MarketplaceModule {}
