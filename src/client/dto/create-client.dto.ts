import { IsEnum, IsString } from 'class-validator';
import { ClientProvider, GrantType } from '../entities/client.entity';

export class CreateClientDto {
  @IsEnum(ClientProvider)
  clientProvider: ClientProvider;

  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;

  @IsEnum(GrantType)
  grantType: GrantType;

  @IsString()
  refreshToken: string;
}
