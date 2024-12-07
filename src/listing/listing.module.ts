import { Module } from '@nestjs/common';
import { AmznModule } from 'src/amzn/amzn.module';
import { ClientModule } from 'src/client/client.module';
import { ListingScheduler } from './listing.scheduler';
import { ListingService } from './listing.service';

@Module({
  imports: [ClientModule, AmznModule],
  providers: [ListingService, ListingScheduler],
})
export class ListingModule {}
