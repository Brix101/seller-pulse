import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Marketplace } from './entities/marketplace.entity';
import { MarketplaceRepository } from './marketplace.repository';

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly em: EntityManager,
    private readonly repo: MarketplaceRepository,
  ) {}

  async findAllByStoreId(storeId: number) {
    const repo = this.em.getRepository(Marketplace);

    const res = await repo
      .createQueryBuilder('m')
      .select(['m.marketplace_id', 'm.*'], true)
      .leftJoinAndSelect('m.client', 'c')
      .leftJoinAndSelect('c.store', 's')
      .where('s.id = ?', [storeId])
      .getResultList();

    const uniqueMarketplaces = Object.values(
      res.reduce(
        (acc, marketplace) => {
          if (!acc[marketplace.marketplaceId]) {
            acc[marketplace.marketplaceId] = {
              marketplaceId: marketplace.marketplaceId,
              name: marketplace.name,
              country: marketplace.country,
              countryCode: marketplace.countryCode,
              defaultCurrencyCode: marketplace.defaultCurrencyCode,
              defaultLanguageCode: marketplace.defaultLanguageCode,
              domainName: marketplace.domainName,
              region: marketplace.region,
            };
          }

          return acc;
        },
        {} as Record<string, Partial<Marketplace>>,
      ),
    );

    return uniqueMarketplaces;
  }
}
