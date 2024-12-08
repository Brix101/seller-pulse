import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientSubscriber } from './client.subscriber';
import { Client } from './entities/client.entity';
import { ClientController } from './client.controller';
import { AmznModule } from 'src/amzn/amzn.module';

@Module({
  imports: [MikroOrmModule.forFeature([Client]), AmznModule],
  providers: [ClientService, ClientSubscriber],
  exports: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
