import { EntityRepository } from '@mikro-orm/postgresql';
import { Marketplace } from './entities/marketplace.entity';

export class MarketplaceRepository extends EntityRepository<Marketplace> {
  async findAllByStoreId(storeId: number): Promise<Marketplace[]> {
    const res = await this.createQueryBuilder('m')
      .select('*')
      .leftJoinAndSelect('m.client', 'c')
      .leftJoinAndSelect('c.store', 's')
      .where('s.id = ?', [storeId])
      .getResultList();

    return res;
  }
}
