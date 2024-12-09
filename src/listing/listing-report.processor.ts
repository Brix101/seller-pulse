import { Logger } from '@nestjs/common';
import { AmznReportService } from 'src/amzn/amzn-report.service';
import { ProcessingStatus, Report } from 'src/amzn/dto/report.dto';
import { QUEUE_KEY } from 'src/common/constants';
import { ParseListingDto } from './dto/parse-listing.dto';
import { QueuedListingDto } from './dto/queued-listing.dto';
import { ListingService } from './listing.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor(QUEUE_KEY.LISTING)
export class ListingReportProcessor extends WorkerHost {
  private logger = new Logger(ListingReportProcessor.name);

  constructor(
    private readonly amznReportService: AmznReportService,
    private readonly listingService: ListingService,
  ) {
    super();
  }

  async process(
    job: Job<QueuedListingDto, ParseListingDto[]>,
  ): Promise<ParseListingDto[]> {
    this.logger.debug('Processing listing started', job.name);

    const { client, reportResponse } = job.data;

    this.logger.debug(
      'Processing listing started for client: ' + client.clientId,
      'Job ID: ' + job.id,
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

    return parseListing;
  }
}
