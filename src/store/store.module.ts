import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Store } from './entities/store.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
