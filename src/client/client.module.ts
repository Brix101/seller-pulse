import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AmznModule } from 'src/amzn/amzn.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientSubscriber } from './client.subscriber';
import { Client } from './entities/client.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Client]), AmznModule],
  providers: [ClientService, ClientSubscriber],
  controllers: [ClientController],
})
export class ClientModule {}
