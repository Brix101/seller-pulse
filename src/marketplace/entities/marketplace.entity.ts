import { Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';

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
