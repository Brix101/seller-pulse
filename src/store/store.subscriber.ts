import { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreSubscriber implements EventSubscriber<Store> {
  constructor(em: EntityManager) {
    em.getEventManager().registerSubscriber(this);
  }

  getSubscribedEntities(): EntityName<Store>[] {
    return [Store];
  }

  async afterInsert(event: EventArgs<Store>) {
    console.log(`A store was inserted: ${event.entity}`);
  }
}
