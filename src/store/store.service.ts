import { EntityManager, NotFoundError, wrap } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(private readonly em: EntityManager) {}

  async create(createStoreDto: CreateStoreDto) {
    try {
      const fork = this.em.fork();
      const store = fork.create(Store, createStoreDto);

      await fork.persistAndFlush(store);

      return store;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findAll(): Promise<Store[]> {
    try {
      const fork = this.em.fork();
      return fork.findAll(Store, {
        // where: { isActive: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findOne(id: number) {
    try {
      const fork = this.em.fork();
      const store = await fork.findOneOrFail(Store, {
        id,
      });

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
      const fork = this.em.fork();
      const store = await this.findOne(id);

      wrap(store).assign(updateStoreDto);

      await fork.persistAndFlush(store);

      return store;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const fork = this.em.fork();
      const store = await this.findOne(id);

      return fork.nativeDelete(Store, { id: store.id });
    } catch (error) {
      throw error;
    }
  }
}
