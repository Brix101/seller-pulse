import { CreateReportResponseDto } from 'src/amzn/dto/report.dto';
import { Client } from 'src/client/entities/client.entity';

export class QueuedListingDto {
  client: Client;
  reportResponse: CreateReportResponseDto;
}
