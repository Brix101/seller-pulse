import { EntityRepository } from '@mikro-orm/postgresql';
import { Client } from './entities/client.entity';

export class ClientRepository extends EntityRepository<Client> {
  // Add custom methods here
}
