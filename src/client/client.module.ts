import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientSubscriber } from './client.subscriber';
import { Client } from './entities/client.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Client])],
  providers: [ClientService, ClientSubscriber],
  exports: [ClientService],
})
export class ClientModule {}
