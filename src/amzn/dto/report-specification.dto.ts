export enum ReportType {
  GET_FLAT_FILE_OPEN_LISTINGS_DATA = 'GET_FLAT_FILE_OPEN_LISTINGS_DATA',
  GET_MERCHANT_LISTINGS_ALL_DATA = 'GET_MERCHANT_LISTINGS_ALL_DATA',
  GET_SALES_AND_TRAFFIC_REPORT = 'GET_SALES_AND_TRAFFIC_REPORT',
}

export type ReportOptions = Record<string, string>;

export class ReportSpecificationDto {
  reportOptions?: ReportOptions;
  reportType: ReportType;
  dataStartTime?: string;
  dataEndTime?: string;
  marketplaceIds: string[];
}
