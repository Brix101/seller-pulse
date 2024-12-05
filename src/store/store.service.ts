import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreRepository } from './store.repository';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  create(createStoreDto: CreateStoreDto) {
    return 'This action adds a new store';
  }

  async findAll(): Promise<Store[]> {
    return this.storeRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
