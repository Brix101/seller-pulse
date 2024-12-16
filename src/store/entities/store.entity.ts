import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Store extends BaseEntity {
  //   [EntityRepositoryType]?: StoreRepository;

  @Property()
  name: string;

  //   @Property()
  //   isActive: boolean & Opt = true;

  //   @OneToMany(() => Client, (c) => c.store, { cascade: [Cascade.ALL] })
  //   clients = new Collection<Client>(this);
}
