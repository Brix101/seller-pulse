import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { Client } from 'src/client/entities/client.entity';
import { ReportSpecificationDto } from './dto/report-specification.dto';
import { SP_API_URL } from 'src/common/constants';
import {
  CreateReportResponseDto,
  Report,
  ReportDocument,
} from './dto/report.dto';
import { LwaService } from 'src/lwa/lwa.service';

@Injectable()
export class AmznReportService {
  private readonly logger = new Logger(AmznReportService.name);
  private readonly BASE_REPORT_URI = '/reports/2021-06-30';

  constructor(
    private readonly httpService: HttpService,
    private readonly lwaService: LwaService,
  ) {}

  async createReport(
    client: Client,
    reportSpecification: ReportSpecificationDto,
  ) {
    const baseUrl = SP_API_URL[client.region] || SP_API_URL.NorthAmerica;

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

    return data;
  }

  async getReport(
    client: Client,
    createReportResponse: CreateReportResponseDto,
  ) {
    const baseUrl = SP_API_URL[client.region] || SP_API_URL.NorthAmerica;

    const accessToken = await this.lwaService.getAccessToken(client);

    const { data } = await firstValueFrom(
      this.httpService
        .get<Report>(
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
  }

  async getReportDocument(client: Client, report: Report) {
    const baseUrl = SP_API_URL[client.region] || SP_API_URL.NorthAmerica;

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
  }
}
