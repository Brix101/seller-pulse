import { EntityManager, NotFoundError } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Store } from 'src/store/entities/store.entity';
import { ClientRepository } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly clientRepository: ClientRepository,
  ) {}

  async create(store: Store, createClientDto: CreateClientDto) {
    try {
      const client = this.clientRepository.create({
        ...createClientDto,
        store,
      });

      await this.em.persistAndFlush(client);

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
      const clients = this.clientRepository.findAll({
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
      const client = await this.clientRepository.findOneOrFail(id);

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
      const client = await this.findOne(id);

      client.assign(updateClientDto);

      await this.em.persistAndFlush(client);

      return client;
    } catch (error) {
      throw error;
    }
  }
}
