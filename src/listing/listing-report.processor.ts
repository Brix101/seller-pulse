import { Logger } from '@nestjs/common';
import { AmznReportService } from 'src/amzn/amzn-report.service';
import { ProcessingStatus, Report } from 'src/amzn/dto/report.dto';
import { QUEUE_KEY } from 'src/common/constants';
import { ParseListingDto } from './dto/parse-listing.dto';
import { QueuedListingDto } from './dto/queued-listing.dto';
import { ListingService } from './listing.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MikroORM } from '@mikro-orm/core';
import { Listing } from './entities/listing.entity';

@Processor(QUEUE_KEY.LISTING)
export class ListingReportProcessor extends WorkerHost {
  private logger = new Logger(ListingReportProcessor.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly amznReportService: AmznReportService,
    private readonly listingService: ListingService,
  ) {
    super();
  }

  async process(
    job: Job<QueuedListingDto, ParseListingDto[]>,
  ): Promise<ParseListingDto[]> {
    this.logger.debug('Processing listing started', job.name);

    const { client, specification } = job.data;

    this.logger.debug(
      'Processing listing started for client: ' + client.clientId,
      'Job ID: ' + job.id,
    );

    const reportResponse = await this.amznReportService.createReport(
      client,
      specification,
    );

    const pollReport = async (): Promise<Report> => {
      this.logger.debug('Polling report' + reportResponse.reportId);
      const result = await this.amznReportService.getReport(
        client,
        reportResponse,
      );

      if (result.processingStatus === ProcessingStatus.DONE) {
        return result;
      }

      return new Promise((resolve) => {
        setTimeout(async () => {
          resolve(await pollReport());
        }, 5000);
      });
    };

    const report = await pollReport();

    const reportDocument = await this.amznReportService.getReportDocument(
      client,
      report,
    );

    const parseListing = await this.listingService.parseListing(reportDocument);

    this.logger.debug(
      'Processing listing completed for client: ' + client.clientId,
      'Job ID: ' + job.id,
    );

    await this.orm.em.transactional(async (em) => {
      for (const listing of parseListing) {
        const newListing = em.create(Listing, {
          ...listing,
          client,
        });

        await em.upsert(Listing, newListing);
      }
    });

    return parseListing;
  }
}
