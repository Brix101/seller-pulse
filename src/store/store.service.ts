import { EntityManager, NotFoundError } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { CreateClientDto } from 'src/client/dto/create-client.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
  constructor(
    private readonly em: EntityManager,
    private readonly storeRepository: StoreRepository,
    private readonly clientService: ClientService,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    try {
      const store = this.storeRepository.create(createStoreDto);

      await this.em.persistAndFlush(store);

      return store;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findAll(): Promise<Store[]> {
    try {
      const stores = await this.storeRepository.findAll();

      return stores;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findOne(id: number) {
    try {
      const store = await this.storeRepository.findOneOrFail(id);

      return store;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(`Store with id ${id} not found`);
      }

      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    try {
      const store = await this.findOne(id);

      store.assign(updateStoreDto);

      await this.em.persistAndFlush(store);

      return store;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const store = await this.findOne(id);

      return this.em.nativeDelete(Store, { id: store.id });
    } catch (error) {
      throw error;
    }
  }

  async addClient(storeId: number, createClientDto: CreateClientDto) {
    try {
      const store = await this.findOne(storeId);
      const client = await this.clientService.create(store, createClientDto);

      return client;
    } catch (error) {
      throw error;
    }
  }

  async getClients(id: number) {
    try {
      const store = await this.findOne(id);
      return this.clientService.findAll(store);
    } catch (error) {
      throw error;
    }
  }
}
