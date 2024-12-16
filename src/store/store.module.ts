import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreRepository } from './store.repository';
import { StoreService } from './store.service';

@Module({
  imports: [MikroOrmModule.forFeature([Store]), CacheModule],
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
})
export class StoreModule {}
