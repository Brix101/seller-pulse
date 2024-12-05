import { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientSubscriber implements EventSubscriber<Client> {
  constructor(em: EntityManager) {
    em.getEventManager().registerSubscriber(this);
  }

  getSubscribedEntities(): EntityName<Client>[] {
    return [Client];
  }

  async afterInsert(event: EventArgs<Client>) {
    console.log(
      '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++',
    );
    console.log(`A client was inserted: ${event.entity}`);
  }
}
