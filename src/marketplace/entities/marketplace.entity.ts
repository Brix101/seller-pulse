import {
  Cascade,
  Entity,
  Enum,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Client } from 'src/client/entities/client.entity';
import { Region } from 'src/common/constants';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
@Unique({ properties: ['marketplaceId', 'client'] })
export class Marketplace extends BaseEntity {
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

  @Enum({ items: () => Region })
  region: Region;

  @ManyToOne(() => Client, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    nullable: false,
    lazy: true,
  })
  client: Client;
}
