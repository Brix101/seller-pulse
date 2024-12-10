import { ReportSpecificationDto } from 'src/amzn/dto/report-specification.dto';
import { Client } from 'src/client/entities/client.entity';

export class QueuedListingDto {
  client: Client;
  specification: ReportSpecificationDto;
}
