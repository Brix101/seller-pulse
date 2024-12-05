import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Store } from 'src/store/entities/store.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(private readonly em: EntityManager) {}

  async create(store: Store, createClientDto: CreateClientDto) {
    try {
      const fork = this.em.fork();
      const client = fork.create(Client, { ...createClientDto, store });

      await fork.persistAndFlush(client);

      return client;
    } catch (error) {
      this.logger.fatal(error);

      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findAll(store: Store) {
    try {
      const fork = this.em.fork();
      const clients = fork.findAll(Client, {
        where: {
          store,
        },
      });

      return clients;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }
}
