import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { ReportDocument } from 'src/amzn/dto/report.dto';
import { ParseListingDto } from './dto/parse-listing.dto';
import { ListingStatus } from './entities/listing.entity';

@Injectable()
export class ListingService {
  private logger = new Logger(ListingService.name);

  constructor(private readonly httpService: HttpService) {}

  async parseListing(reportDocument: ReportDocument) {
    const { data } = await firstValueFrom(
      this.httpService.get<string>(reportDocument.url).pipe(
        catchError((error) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );

    const parseListing: ParseListingDto[] = data
      // Split the document data into lines and filter out empty lines
      .split('\n')
      .filter((line) => line.trim() !== '')
      // Skip the header line and map each line to an object representing a report entry
      .slice(1)
      .map((line) => {
        const columns: string[] = line.split('\t'); // Split the line into columns based on tab delimiter
        const sellerSKU = columns[3]; // Extract seller SKU from the columns
        const asin = columns[16]; // Extract ASIN from the columns
        const status = ListingStatus[columns[28]] || ListingStatus.INCOMPLETE; // Extract status from the columns

        return { sellerSKU, asin, status }; // Return an object representing a report entry
      })
      // Filter out entries with empty ASIN values
      .filter((entry) => entry.asin !== '');

    return parseListing;
  }
}
