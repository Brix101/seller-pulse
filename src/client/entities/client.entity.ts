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
import { Region } from 'src/common/constants';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Marketplace } from 'src/marketplace/entities/marketplace.entity';
import { Store } from 'src/store/entities/store.entity';
import { RequestAccessTokenDto } from '../../amzn/dto/lwa-request.dto';
import { ClientRepository } from '../client.repository';
import { LWAExceptionErrorCode } from '../exceptions/exception-error-code';

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

  @Enum({ items: () => Region, nullable: true, default: null, hidden: true })
  region?: Region;

  @Enum({ items: () => LWAExceptionErrorCode, nullable: true, default: null })
  error?: LWAExceptionErrorCode;

  @Property({ columnType: 'text', nullable: true, default: null })
  errorDescription?: string;

  @ManyToOne(() => Store, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    nullable: false,
    serializer: (store) => store.id,
    serializedName: 'storeId',
  })
  store: Store;

  @OneToMany(() => Marketplace, (m) => m.client, {
    cascade: [Cascade.ALL],
  })
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
