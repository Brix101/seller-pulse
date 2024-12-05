import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';

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
}
