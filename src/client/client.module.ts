import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientSubscriber } from './client.subscriber';
import { Client } from './entities/client.entity';
import { ClientController } from './client.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Client])],
  providers: [ClientService, ClientSubscriber],
  exports: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
