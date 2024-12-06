import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { Client } from '../../client/entities/client.entity';

@Entity()
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

  @ManyToOne(() => Client, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    nullable: false,
    lazy: true,
  })
  client: Client;
}
