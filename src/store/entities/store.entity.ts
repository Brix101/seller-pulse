import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  Opt,
  Property,
} from '@mikro-orm/core';
import { Client } from '../../client/entities/client.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { StoreRepository } from '../store.repository';

@Entity({ repository: () => StoreRepository })
export class Store extends BaseEntity {
  [EntityRepositoryType]?: StoreRepository;

  @Property()
  name: string;

  @Property()
  isActive: boolean & Opt = true;

  @OneToMany(() => Client, (c) => c.store, { cascade: [Cascade.ALL] })
  client = new Collection<Client>(this);
}
