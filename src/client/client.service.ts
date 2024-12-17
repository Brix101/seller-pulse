import {
  EntityManager,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AmznMarketplaceService } from 'src/amzn/amzn-marketplace.service';
import { Region } from 'src/common/constants';
import { Marketplace } from 'src/marketplace/entities/marketplace.entity';
import { Store } from 'src/store/entities/store.entity';
import { ClientRepository } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  private logger = new Logger(ClientService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly clientRepository: ClientRepository,
    private readonly amznMarketplaceService: AmznMarketplaceService,
  ) {}

  async create({ storeId, ...data }: CreateClientDto) {
    try {
      const store = await this.em.findOneOrFail(Store, storeId);

      const client = this.clientRepository.create({
        ...data,
        store,
      });
      const marketplaces =
        await this.amznMarketplaceService.getMarketplaceParticipations(client);

      const newMarketplaces = marketplaces.map((marketplace) =>
        this.em.create(Marketplace, {
          ...marketplace,
          client,
        }),
      );

      client.marketplaces.add(newMarketplaces);

      const regionRecord = marketplaces.reduce(
        (acc, marketplace) => {
          acc[marketplace.region] = (acc[marketplace.region] || 0) + 1;
          return acc;
        },
        {} as Record<Region, number>,
      );

      const mostRegion = Object.entries(regionRecord).reduce((a, b) =>
        b[1] > a[1] ? b : a,
      )[0];

      client.region = Region[mostRegion as keyof typeof Region];

      await this.em.persistAndFlush(client);

      return client;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          error.name,
          'clientId already registered for this store',
        );
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(error || 'Something went wrong');
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

      await this.em.nativeUpdate(
        Client,
        {
          id: client.id,
        },
        updateClientDto,
      );
      return client;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const client = await this.findOne(id);

      await this.em.nativeDelete(Client, { id: client.id });

      return client;
    } catch (error) {
      throw error;
    }
  }

  async updateClientMarketplaces(client: Client) {
    try {
      const marketplaces =
        await this.amznMarketplaceService.getMarketplaceParticipations(client);

      await this.em.transactional(async (em) => {
        const region_record: Record<Region, number> = {
          [Region.NorthAmerica]: 0,
          [Region.Europe]: 0,
          [Region.FarEast]: 0,
        };

        for (const marketplace of marketplaces) {
          region_record[marketplace.region]++;

          const newMarketplace = em.create(Marketplace, {
            ...marketplace,
            client,
          });

          await em.upsert(Marketplace, newMarketplace);
        }

        const most_region = Object.entries(region_record).reduce((a, b) =>
          b[1] > a[1] ? b : a,
        )[0];

        await em.nativeUpdate(
          Client,
          {
            id: client.id,
          },
          {
            region: Region[most_region as keyof typeof Region],
          },
        );
      });
    } catch (err) {
      throw err;
    }
  }
}
