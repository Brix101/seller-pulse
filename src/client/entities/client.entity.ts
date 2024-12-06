import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { TokenRequestMeta } from '../../lwa/dto/token-request-meta';
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

  toTokenRequestMeta(): TokenRequestMeta {
    return {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      grantType: this.grantType,
      refreshToken: this.refreshToken,
    };
  }
}
