import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { StoreRepository } from './store.repository';
import { EntityManager, wrap } from '@mikro-orm/postgresql';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly em: EntityManager,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const fork = this.em.fork();
    const store = fork.create(Store, createStoreDto);

    await fork.persistAndFlush(store);

    return store;
  }

  async findAll(): Promise<Store[]> {
    const fork = this.em.fork();
    return fork.findAll(Store, {
      where: { isActive: true },
    });
  }

  findOne(id: number) {
    const fork = this.em.fork();

    return fork.findOneOrFail(Store, {
      id,
    });
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const fork = this.em.fork();

    const store = await fork.findOneOrFail(Store, { id });

    wrap(store).assign(updateStoreDto);

    await fork.persistAndFlush(store);

    return store;
  }

  async remove(id: number) {
    const fork = this.em.fork();

    return fork.nativeDelete(Store, { id });
  }
}
