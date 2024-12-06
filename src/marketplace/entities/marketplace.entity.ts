import {
  Cascade,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Client } from '../../client/entities/client.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { MarketplaceRepository } from '../marketplace.repository';

@Entity({
  repository: () => MarketplaceRepository,
})
@Unique({ properties: ['marketplaceId', 'client'] })
export class Marketplace extends BaseEntity {
  [EntityRepositoryType]?: MarketplaceRepository;

  @Property()
  name: string;

  @Property()
  country: string;

  @Property()
  marketplaceId: string;

  @Property()
  countryCode: string;

  @Property()
  defaultCurrencyCode: string;

  @Property()
  defaultLanguageCode: string;

  @Property()
  domainName: string;

  @Property()
  region: string;

  @ManyToOne(() => Client, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    nullable: false,
    lazy: true,
  })
  client: Client;
}
