import { EntityRepository } from '@mikro-orm/postgresql';
import { Marketplace } from './entities/marketplace.entity';

export class MarketplaceRepository extends EntityRepository<Marketplace> {}
