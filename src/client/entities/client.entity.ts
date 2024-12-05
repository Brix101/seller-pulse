import { Cascade, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Store } from 'src/store/entities/store.entity';

export enum ClientProvider {
  SELLING_PARTNER_API = 'SELLING_PARTNER_API',
  ADVERTISING_API = 'ADVERTISING_API',
}

export enum GrantType {
  CLIENT_CREDENTIALS = 'client_credentials',
  REFRESH_TOKEN = 'refresh_token',
}

export enum LWAExceptionErrorCode {
  access_denied,
  invalid_grant,
  invalid_request,
  invalid_scope,
  server_error,
  unsupported_grant_type,
  temporarily_unavailable,
  unauthorized_client,
  invalid_client,
  other,
}

@Entity()
export class Client extends BaseEntity {
  @Enum({ items: () => ClientProvider })
  clientProvider: ClientProvider;

  @Property()
  clientId: string;

  @Property()
  clientSecret: string;

  @Enum({ items: () => GrantType })
  grantType: GrantType;

  @Property()
  refreshToken: string;

  @Enum({ items: () => LWAExceptionErrorCode })
  error: LWAExceptionErrorCode;

  @Property()
  errorDescription: string;

  @ManyToOne(() => Store, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    nullable: false,
  })
  store: Store;
}
