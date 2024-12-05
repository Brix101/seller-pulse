import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Client } from './entities/client.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Client])],
})
export class ClientModule {}
