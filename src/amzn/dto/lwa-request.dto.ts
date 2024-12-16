import { GrantType } from '../../client/entities/client.entity';

export class RequestAccessTokenDto {
  client_id: string;
  client_secret: string;
  grant_type: GrantType;
  refresh_token: string;
}
