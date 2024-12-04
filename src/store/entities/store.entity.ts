import { Entity, Opt, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Store extends BaseEntity {
  @Property()
  name: string;

  @Property()
  isActive: boolean & Opt = true;
}
