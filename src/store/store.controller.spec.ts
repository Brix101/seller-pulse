import { Test, TestingModule } from '@nestjs/testing';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

describe('StoreController', () => {
  let controller: StoreController;
  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a store', async () => {
    const createStoreDto: CreateStoreDto = {
      name: 'DStore',
    };
    const result = new Store();
    result.name = 'DStore';
    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createStoreDto)).toBe(result);
  });

  it('should return an array of stores', async () => {
    const stores: Store[] = [];

    const createStore = (id: number, name: string): Store => {
      const store = new Store();
      store.id = id;
      store.name = name;
      return store;
    };

    stores.push(createStore(1, 'DStore'));
    stores.push(createStore(2, 'EStore'));

    jest.spyOn(service, 'findAll').mockResolvedValue(stores);

    expect(await controller.findAll()).toBe(stores);
  });

  it('should return a single store', async () => {
    const result = new Store();
    result.id = 1;
    result.name = 'DStore';

    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    expect(await controller.findOne('1')).toBe(result);
  });

  it('should update a store', async () => {
    const updateStoreDto: UpdateStoreDto = {
      name: 'UpdatedStore',
    };

    const result = new Store();
    result.id = 1;
    result.name = 'UpdatedStore';

    jest.spyOn(service, 'update').mockResolvedValue(result);

    expect(await controller.update('1', updateStoreDto)).toBe(result);
  });

  it('should remove a store', async () => {
    const result = 1;

    jest.spyOn(service, 'remove').mockResolvedValue(result);

    expect(await controller.remove('1')).toBe(result);
  });
});
