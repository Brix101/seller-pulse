import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { AmznReportService } from 'src/amzn/amzn-report.service';
import {
  ReportSpecificationDto,
  ReportType,
} from 'src/amzn/dto/report-specification.dto';
import { ClientService } from 'src/client/client.service';
import { QUEUE_KEY } from 'src/common/constants';
import { QueuedListingDto } from './dto/queued-listing.dto';
import { Listing } from './entities/listing.entity';

@Injectable()
export class ListingScheduler {
  private logger = new Logger(ListingScheduler.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly clientService: ClientService,
    private readonly amznReportService: AmznReportService,
    @InjectQueue(QUEUE_KEY.LISTING)
    private readonly listingQueue: Queue<QueuedListingDto>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @CreateRequestContext()
  async handleListingCronJob() {
    this.logger.debug('Running Listing cron job');
    const clients = await this.clientService.findAll();

    for (const client of clients) {
      try {
        const marketplaceIds = client.marketplaces.map((m) => m.marketplaceId);
        const reportSpecification: ReportSpecificationDto = {
          reportType: ReportType.GET_MERCHANT_LISTINGS_ALL_DATA,
          marketplaceIds,
        };

        const reportResponse = await this.amznReportService.createReport(
          client,
          reportSpecification,
        );

        const job = await this.listingQueue.add(
          QUEUE_KEY.LISTING + ':parse',
          {
            client,
            reportResponse,
          },
          {
            delay: 5000,
          },
        );

        const parsedListings = await job.finished();

        await this.orm.em.transactional(async (em) => {
          for (const listing of parsedListings) {
            const newListing = em.create(Listing, {
              ...listing,
              client,
            });

            await em.upsert(Listing, newListing);
          }
        });
      } catch (err) {
        this.logger.error(
          err,
          `Couldn't fetch Listings for client ${client.clientId}`,
        );
      }
    }
    this.logger.debug('Listing cron job completed');
  }
}
