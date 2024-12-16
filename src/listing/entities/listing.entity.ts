import {
  Cascade,
  Entity,
  Enum,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/postgresql';
import { Client } from 'src/client/entities/client.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

export enum ListingStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  INCOMPLETE = 'incomplete',
}

@Entity()
@Unique({ properties: ['asin', 'sellerSKU', 'client'] })
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
