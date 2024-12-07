import {
  Cascade,
  Entity,
  Enum,
  ManyToOne,
  Property,
} from '@mikro-orm/postgresql';
import { BaseEntity } from '../../common/entities/base.entity';
import { Client } from '../../client/entities/client.entity';

export enum ListingStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  INCOMPLETE = 'incomplete',
}

@Entity()
export class Listing extends BaseEntity {
  @Property()
  sellerSKU: string;

  @Property()
  asin: string;

  @Enum({ items: () => ListingStatus })
  status: ListingStatus;

  @ManyToOne(() => Client, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    nullable: false,
    lazy: true,
  })
  client: Client;
}
