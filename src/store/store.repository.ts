import { EntityRepository } from '@mikro-orm/postgresql';
import { Store } from './entities/store.entity';

export class StoreRepository extends EntityRepository<Store> {
  // Add custom methods here
}
