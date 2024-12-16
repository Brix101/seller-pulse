import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Opt,
  Property,
} from '@mikro-orm/core';
import { Client } from 'src/client/entities/client.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Store extends BaseEntity {
  @Property()
  name: string;

  @Property()
  isActive: boolean & Opt = true;

  @OneToMany(() => Client, (c) => c.store, { cascade: [Cascade.ALL] })
  clients = new Collection<Client>(this);
}
