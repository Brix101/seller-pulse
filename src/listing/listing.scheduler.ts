import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { AmznReportService } from 'src/amzn/amzn-report.service';
import {
  ReportSpecificationDto,
  ReportType,
} from 'src/amzn/dto/report-specification.dto';
import { ClientService } from 'src/client/client.service';
import { QUEUE_KEY } from 'src/common/constants';
import { ParseListingDto } from './dto/parse-listing.dto';
import { QueuedListingDto } from './dto/queued-listing.dto';

@Injectable()
export class ListingScheduler {
  private logger = new Logger(ListingScheduler.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly clientService: ClientService,
    @InjectQueue(QUEUE_KEY.LISTING)
    private readonly listingQueue: Queue<QueuedListingDto, ParseListingDto[]>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @CreateRequestContext()
  async handleListingCronJob() {
    this.logger.debug('Running Listing cron job');
    const clients = await this.clientService.findAll();

    const listingQueues: Parameters<typeof this.listingQueue.addBulk>[0] = [];

    for (const client of clients) {
      const marketplaceIds = client.marketplaces.map((m) => m.marketplaceId);

      listingQueues.push({
        name: QUEUE_KEY.LISTING + ':parse',
        data: {
          client,
          specification: {
            reportType: ReportType.GET_MERCHANT_LISTINGS_ALL_DATA,
            marketplaceIds,
          },
        },
        opts: {
          removeOnComplete: true,
        },
      });
    }

    await this.listingQueue.addBulk(listingQueues);

    this.logger.debug('Listing cron job completed');
  }
}
