import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { StoreSubscriber } from './store.subscriber';

@Module({
  imports: [MikroOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService, StoreSubscriber],
})
export class StoreModule {}
