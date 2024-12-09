import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_KEY } from 'src/common/constants';
import { QueuedListingDto } from './dto/queued-listing.dto';
import { ParseListingDto } from './dto/parse-listing.dto';
import { Listing } from './entities/listing.entity';

@QueueEventsListener(QUEUE_KEY.LISTING)
export class ListingQueueEventsListener extends QueueEventsHost {
  private logger = new Logger(ListingQueueEventsListener.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly listingQueue: Queue<QueuedListingDto, ParseListingDto[]>,
  ) {
    super();
  }

  @OnQueueEvent('completed')
  @CreateRequestContext()
  async onCompleted({
    jobId,
    returnvalue,
  }: {
    jobId: string;
    returnvalue: ParseListingDto[];
    prev?: string;
  }) {
    const job = await this.listingQueue.getJob(jobId);

    if (job) {
      const client = job.data.client;
      await this.orm.em.transactional(async (em) => {
        for (const listing of returnvalue) {
          const newListing = em.create(Listing, {
            ...listing,
            client,
          });

          await em.upsert(Listing, newListing);
        }
      });
      this.logger.debug('Completed job', jobId);
    }
  }
}
