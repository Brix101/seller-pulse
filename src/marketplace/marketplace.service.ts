import { Injectable } from '@nestjs/common';
import { MarketplaceRepository } from './marketplace.repository';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly em: EntityManager,
    private readonly marketplaceRepository: MarketplaceRepository,
  ) {}
}
