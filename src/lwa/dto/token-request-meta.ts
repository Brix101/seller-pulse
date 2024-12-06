import { GrantType } from 'src/client/entities/client.entity';

export class TokenRequestMeta {
  clientId: string;
  clientSecret: string;
  grantType: GrantType;
  refreshToken: string;
}
