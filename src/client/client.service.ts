import { EntityManager, NotFoundError } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Store } from 'src/store/entities/store.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';
import { UpdateClientDto } from './dto/update-client.dto';

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

  async findOne(id: number) {
    try {
      const fork = this.em.fork();
      const client = await fork.findOneOrFail(Client, {
        id,
      });

      return client;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(`Client with id ${id} not found`);
      }

      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      const fork = this.em.fork();
      const client = await this.findOne(id);

      fork.assign(client, updateClientDto);

      await fork.persistAndFlush(client);

      return client;
    } catch (error) {
      throw error;
    }
  }
}
