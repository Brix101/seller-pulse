import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { StoreRepository } from './store.repository';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let repository: StoreRepository;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        StoreService,
        {
          provide: StoreRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {
            persistAndFlush: jest.fn(),
            nativeUpdate: jest.fn(),
            nativeDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<StoreRepository>(StoreRepository);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a store', async () => {
      const createStoreDto: CreateStoreDto = {
        name: 'DStore',
      };
      const store = new Store();
      jest.spyOn(repository, 'create').mockReturnValue(store);
      jest.spyOn(em, 'persistAndFlush').mockResolvedValue();

      expect(await service.create(createStoreDto)).toBe(store);
      expect(repository.create).toHaveBeenCalledWith(createStoreDto);
      expect(em.persistAndFlush).toHaveBeenCalledWith(store);
    });

    it('should throw an InternalServerErrorException', async () => {
      const createStoreDto: CreateStoreDto = {
        name: 'DStore',
      };
      jest.spyOn(repository, 'create').mockImplementation(() => {
        throw new Error('Error');
      });

      await expect(service.create(createStoreDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of stores', async () => {
      const stores = [new Store()];
      jest.spyOn(repository, 'findAll').mockResolvedValue(stores);

      expect(await service.findAll()).toBe(stores);
      expect(repository.findAll).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException', async () => {
      jest.spyOn(repository, 'findAll').mockImplementation(() => {
        throw new Error('Error');
      });

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a store', async () => {
      const store = new Store();
      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(store);

      expect(await service.findOne(1)).toBe(store);
      expect(repository.findOneOrFail).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockImplementation(() => {
        throw new NotFoundError('Error');
      });

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw an InternalServerErrorException', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockImplementation(() => {
        throw new Error('Error');
      });

      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a store', async () => {
      const updateStoreDto: UpdateStoreDto = {
        /* ...properties... */
      };
      const store = new Store();
      jest.spyOn(service, 'findOne').mockResolvedValue(store);
      jest.spyOn(em, 'nativeUpdate').mockResolvedValue(1);

      expect(await service.update(1, updateStoreDto)).toBe(store);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(em.nativeUpdate).toHaveBeenCalledWith(
        Store,
        { id: store.id },
        updateStoreDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a store', async () => {
      const store = new Store();
      jest.spyOn(service, 'findOne').mockResolvedValue(store);
      jest.spyOn(em, 'nativeDelete').mockResolvedValue(1);

      expect(await service.remove(1)).toBe(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(em.nativeDelete).toHaveBeenCalledWith(Store, { id: store.id });
    });
  });
});
