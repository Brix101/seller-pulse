import { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientSubscriber implements EventSubscriber<Client> {
  constructor(
    private readonly em: EntityManager,
    private readonly clientService: ClientService,
  ) {
    this.em.getEventManager().registerSubscriber(this);
  }

  getSubscribedEntities(): EntityName<Client>[] {
    return [Client];
  }

  async afterCreate(args: EventArgs<Client>) {
    await this.clientService.updateClientMarketplaces(args.entity);
  }
}
