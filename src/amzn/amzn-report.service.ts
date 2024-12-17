import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';
import { Client } from 'src/client/entities/client.entity';
import { SP_API_URL } from 'src/common/constants';
import { ReportSpecificationDto } from './dto/report-specification.dto';
import {
  CreateReportResponseDto,
  ReportDocument,
  ReportDto,
} from './dto/report.dto';
import { LwaService } from './lwa.service';

@Injectable()
export class AmznReportService {
  private logger = new Logger(AmznReportService.name);
  private readonly BASE_REPORT_URI = '/reports/2021-06-30';

  constructor(
    private readonly httpService: HttpService,
    private readonly lwaService: LwaService,
    private readonly cacheService: CacheService,
  ) {}

  private async getExistingReport(
    client: Client,
    reportSpecification: ReportSpecificationDto,
  ) {
    const reportKey = `report:${client.clientId}:${JSON.stringify(reportSpecification)}`;

    const cachedReport =
      await this.cacheService.get<CreateReportResponseDto>(reportKey);

    return {
      reportKey,
      cachedReport,
    };
  }

  /**
   * Creates a report for the given client based on the provided report specification.
   * @param client The client for whom the report is being created.
   * @param reportSpecification The specifications for the report to be created.
   * @returns The response data containing details of the created report.
   */
  async createReport(
    client: Client,
    reportSpecification: ReportSpecificationDto,
  ) {
    try {
      const { reportKey, cachedReport } = await this.getExistingReport(
        client,
        reportSpecification,
      );

      if (cachedReport) {
        return cachedReport;
      }

      const baseUrl = SP_API_URL[client?.region ?? 'NorthAmerica'];

      const accessToken = await this.lwaService.getAccessToken(client);

      const { data } = await firstValueFrom(
        this.httpService
          .post<CreateReportResponseDto>(
            baseUrl + this.BASE_REPORT_URI + '/reports',
            reportSpecification,
            {
              headers: {
                'x-amz-access-token': accessToken,
              },
            },
          )
          .pipe(
            catchError((error) => {
              this.logger.error(error);

              throw error;
            }),
          ),
      );

      // Store the result in the cache
      await this.cacheService.set(reportKey, data, '1h');

      return data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /**
   * Retrieves the report details for the given client and report response.
   * @param client The client for whom the report is being retrieved.
   * @param createReportResponse The response data from the report creation.
   * @returns The report details.
   */
  async getReport(
    client: Client,
    createReportResponse: CreateReportResponseDto,
  ) {
    try {
      const baseUrl = SP_API_URL[client?.region ?? 'NorthAmerica'];

      const accessToken = await this.lwaService.getAccessToken(client);

      const { data } = await firstValueFrom(
        this.httpService
          .get<ReportDto>(
            baseUrl +
              this.BASE_REPORT_URI +
              '/reports/' +
              createReportResponse.reportId,
            {
              headers: {
                'x-amz-access-token': accessToken,
              },
            },
          )
          .pipe(
            catchError((error) => {
              this.logger.error(error);

              throw error;
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /**
   * Retrieves the report document for the given client and report.
   * @param client The client for whom the report document is being retrieved.
   * @param report The report containing the document ID.
   * @returns The report document details.
   */
  async getReportDocument(client: Client, report: ReportDto) {
    try {
      const baseUrl = SP_API_URL[client?.region ?? 'NorthAmerica'];

      const accessToken = await this.lwaService.getAccessToken(client);

      const { data } = await firstValueFrom(
        this.httpService
          .get<ReportDocument>(
            baseUrl +
              this.BASE_REPORT_URI +
              '/documents/' +
              report.reportDocumentId,
            {
              headers: {
                'x-amz-access-token': accessToken,
              },
            },
          )
          .pipe(
            catchError((error) => {
              this.logger.error(error);

              throw error;
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
