import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { AmznReportService } from 'src/amzn/amzn-report.service';
import { ProcessingStatus, Report } from 'src/amzn/dto/report.dto';
import { QUEUE_KEY } from 'src/common/constants';
import { ParseListingDto } from './dto/parse-listing.dto';
import { QueuedListingDto } from './dto/queued-listing.dto';
import { ListingService } from './listing.service';

@Processor(QUEUE_KEY.LISTING)
export class ListingReportProcessor {
  private logger = new Logger(ListingReportProcessor.name);

  constructor(
    private readonly amznReportService: AmznReportService,
    private readonly listingService: ListingService,
  ) {}

  @Process(QUEUE_KEY.LISTING + ':parse')
  async process(job: Job<QueuedListingDto>): Promise<ParseListingDto[]> {
    const { client, reportResponse } = job.data;

    this.logger.debug(
      'Processing listing started for client: ' + client.clientId,
      JSON.stringify(reportResponse),
    );

    const pollReport = async (): Promise<Report> => {
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
      JSON.stringify(reportResponse),
    );
    return parseListing;
  }
}
