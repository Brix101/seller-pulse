import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LwaService } from './lwa.service';

@Module({
  imports: [HttpModule],
  providers: [LwaService],
})
export class LwaModule {}
