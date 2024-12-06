import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [MikroOrmModule.forFeature([Store]), ClientModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
