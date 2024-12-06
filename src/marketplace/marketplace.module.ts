import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { Marketplace } from './entities/marketplace.entity';
import { MarketplaceScheduler } from './marketplace.scheduler';
import { MarketplaceService } from './marketplace.service';
import { AmznModule } from 'src/amzn/amzn.module';

@Module({
  imports: [MikroOrmModule.forFeature([Marketplace]), ClientModule, AmznModule],
  providers: [MarketplaceService, MarketplaceScheduler],
})
export class MarketplaceModule {}
