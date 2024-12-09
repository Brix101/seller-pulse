import {
  EntityManager,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Store } from 'src/store/entities/store.entity';
import { ClientRepository } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { AmznMarketplaceService } from 'src/amzn/amzn-marketplace.service';
import { Marketplace } from 'src/marketplace/entities/marketplace.entity';

@Injectable()
export class ClientService {
  private logger = new Logger(ClientService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly clientRepository: ClientRepository,
    private readonly amznMarketplaceService: AmznMarketplaceService,
  ) {}

  async create(store: Store, createClientDto: CreateClientDto) {
    try {
      const client = this.clientRepository.create({
        ...createClientDto,
        store,
      });

      await this.em.persistAndFlush(client);

      delete client.marketplaces;

      return client;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          'Client with this clientId already exists for this store',
        );
      }

      this.logger.fatal(error);

      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findAll() {
    try {
      const clients = await this.clientRepository.findAll({
        where: {
          error: null,
        },
        populate: ['marketplaces'],
      });

      return clients;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findAllByStore(store: Store) {
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
      const client = await this.clientRepository.findOneOrFail(id, {
        populate: ['marketplaces'],
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
      const client = await this.findOne(id);

      client.assign(updateClientDto);

      await this.em.persistAndFlush(client);

      return client;
    } catch (error) {
      throw error;
    }
  }

  async updateMarketplace(client: Client) {
    try {
      const marketplaces =
        await this.amznMarketplaceService.getMarketplaceParticipations(client);

      await this.em.transactional(async (em) => {
        em.assign(client, { region: marketplaces[0].region });

        for (const marketplace of marketplaces) {
          const newMarketplace = em.create(Marketplace, {
            ...marketplace,
            client,
          });

          await em.upsert(Marketplace, newMarketplace);
        }
      });
    } catch (err) {
      this.logger.error(
        err,
        `Failed to update marketplaces for client ${client.clientId}`,
      );
    }
  }
}
