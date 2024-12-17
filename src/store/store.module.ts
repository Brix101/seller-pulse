import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MarketplaceModule } from 'src/marketplace/marketplace.module';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [MikroOrmModule.forFeature([Store]), MarketplaceModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
