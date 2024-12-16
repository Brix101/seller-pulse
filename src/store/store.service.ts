import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
  constructor(
    private readonly repo: StoreRepository,
    private readonly em: EntityManager,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    try {
      const store = this.repo.create(createStoreDto);

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
      const stores = await this.repo.findAll();

      return stores;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findOne(id: number) {
    try {
      const store = await this.repo.findOneOrFail(id);

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

      await this.em.nativeUpdate(Store, { id: store.id }, updateStoreDto);

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
}
