import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [TerminusModule, HttpModule, MikroOrmModule],
  controllers: [HealthController],
})
export class HealthModule {}
