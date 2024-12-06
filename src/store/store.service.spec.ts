import { EntityManager } from '@mikro-orm/postgresql';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientModule } from '../client/client.module';
import { ClientService } from '../client/client.service';
import { CreateClientDto } from '../client/dto/create-client.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { StoreRepository } from './store.repository';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let em: EntityManager;
  let storeRepository: StoreRepository;
  let clientService: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: EntityManager,
          useValue: {
            persistAndFlush: jest.fn(),
            nativeDelete: jest.fn(),
          },
        },
        {
          provide: StoreRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
        {
          provide: ClientService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
      imports: [ClientModule],
    }).compile();

    service = module.get<StoreService>(StoreService);
    em = module.get<EntityManager>(EntityManager);
    storeRepository = module.get<StoreRepository>(StoreRepository);
    clientService = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a store', async () => {
      const createStoreDto: CreateStoreDto = { name: 'Test Store' };
      const store = new Store();
      (storeRepository.create as jest.Mock).mockReturnValue(store);
      (em.persistAndFlush as jest.Mock).mockResolvedValue(undefined);

      const result = await service.create(createStoreDto);

      expect(result).toBe(store);
      expect(storeRepository.create).toHaveBeenCalledWith(createStoreDto);
      expect(em.persistAndFlush).toHaveBeenCalledWith(store);
    });

    it('should throw an error if creation fails', async () => {
      const createStoreDto: CreateStoreDto = { name: 'Test Store' };
      (storeRepository.create as jest.Mock).mockImplementation(() => {
        throw new Error('Error');
      });

      await expect(service.create(createStoreDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all stores', async () => {
      const stores = [new Store()];
      (storeRepository.findAll as jest.Mock).mockResolvedValue(stores);

      const result = await service.findAll();

      expect(result).toBe(stores);
      expect(storeRepository.findAll).toHaveBeenCalled();
    });

    it('should throw an error if findAll fails', async () => {
      (storeRepository.findAll as jest.Mock).mockImplementation(() => {
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
      (storeRepository.findOneOrFail as jest.Mock).mockResolvedValue(store);

      const result = await service.findOne(1);

      expect(result).toBe(store);
      expect(storeRepository.findOneOrFail).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if store is not found', async () => {
      (storeRepository.findOneOrFail as jest.Mock).mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a store', async () => {
      const updateStoreDto: UpdateStoreDto = { name: 'Updated Store' };
      const store = new Store();
      jest.spyOn(service, 'findOne').mockResolvedValue(store);
      (em.persistAndFlush as jest.Mock).mockResolvedValue(undefined);

      const result = await service.update(1, updateStoreDto);

      expect(result).toBe(store);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(store);
    });
  });

  describe('remove', () => {
    it('should remove a store', async () => {
      const store = new Store();
      jest.spyOn(service, 'findOne').mockResolvedValue(store);
      (em.nativeDelete as jest.Mock).mockResolvedValue(1);

      const result = await service.remove(1);

      expect(result).toBe(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(em.nativeDelete).toHaveBeenCalledWith(Store, { id: store.id });
    });
  });

  describe('addClient', () => {
    it('should add a client to a store', async () => {
      const store = new Store();
      const createClientDto = new CreateClientDto();
      const client = { id: 1, name: 'Client' };
      jest.spyOn(service, 'findOne').mockResolvedValue(store);
      (clientService.create as jest.Mock).mockResolvedValue(client);

      const result = await service.addClient(1, createClientDto);

      expect(result).toBe(client);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(clientService.create).toHaveBeenCalledWith(store, createClientDto);
    });
  });

  describe('getClients', () => {
    it('should return all clients of a store', async () => {
      const store = new Store();
      const clients = [{ id: 1, name: 'Client' }];
      jest.spyOn(service, 'findOne').mockResolvedValue(store);
      (clientService.findAllByStore as jest.Mock).mockResolvedValue(clients);

      const result = await service.getClients(1);

      expect(result).toBe(clients);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(clientService.findAllByStore).toHaveBeenCalledWith(store);
    });
  });
});
