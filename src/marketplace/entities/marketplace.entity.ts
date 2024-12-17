import {
  Cascade,
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Client } from 'src/client/entities/client.entity';
import { Region } from 'src/common/constants';
import { BaseEntity } from 'src/common/entities/base.entity';
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

  @Property({ primary: true })
  marketplaceId: string;

  @Property()
  countryCode: string;

  @Property()
  defaultCurrencyCode: string;

  @Property()
  defaultLanguageCode: string;

  @Property()
  domainName: string;

  @Enum({ items: () => Region })
  region: Region;

  @ManyToOne(() => Client, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    nullable: false,
    lazy: true,
    hidden: true,
  })
  client: Client;
}
