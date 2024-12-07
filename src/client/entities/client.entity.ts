import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Region } from '../../common/constants';
import { BaseEntity } from '../../common/entities/base.entity';
import { RequestAccessTokenDto } from '../../lwa/dto/request-access-token.dto';
import { LWAExceptionErrorCode } from '../../lwa/exceptions/exception-error-code';
import { Marketplace } from '../../marketplace/entities/marketplace.entity';
import { Store } from '../../store/entities/store.entity';
import { ClientRepository } from '../client.repository';

export enum ClientProvider {
  SELLING_PARTNER_API = 'SELLING_PARTNER_API',
  ADVERTISING_API = 'ADVERTISING_API',
}

export enum GrantType {
  CLIENT_CREDENTIALS = 'client_credentials',
  REFRESH_TOKEN = 'refresh_token',
}

@Entity({ repository: () => ClientRepository })
@Unique({ properties: ['clientId', 'store'] })
export class Client extends BaseEntity {
  [EntityRepositoryType]?: ClientRepository;

  @Enum({ items: () => ClientProvider })
  clientProvider: ClientProvider;

  @Property()
  clientId: string;

  @Property()
  clientSecret: string;

  @Enum({ items: () => GrantType })
  grantType: GrantType;

  @Property({ columnType: 'text' })
  refreshToken: string;

  @Enum({ items: () => Region })
  region: Region;

  @Enum({ items: () => LWAExceptionErrorCode, nullable: true, default: null })
  error: LWAExceptionErrorCode;

  @Property({ columnType: 'text', nullable: true, default: null })
  errorDescription: string;

  @ManyToOne(() => Store, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    nullable: false,
    serializer: (store) => store.id,
    serializedName: 'storeId',
    // lazy: true,
  })
  store: Store;

  @OneToMany(() => Marketplace, (m) => m.client, { cascade: [Cascade.ALL] })
  marketplaces = new Collection<Marketplace>(this);

  toRequestAcessTokenDTO(): RequestAccessTokenDto {
    return {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: this.grantType,
      refresh_token: this.refreshToken,
    };
  }
}
