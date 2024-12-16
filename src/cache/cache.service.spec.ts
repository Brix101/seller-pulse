import { Test, TestingModule } from '@nestjs/testing';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let cache: Cacheable;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: 'CACHE_INSTANCE',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cache = module.get<Cacheable>('CACHE_INSTANCE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a value from the cache', async () => {
    const key = 'testKey';
    const value = 'testValue';
    jest.spyOn(cache, 'get').mockResolvedValue(value);

    const result = await service.get<string>(key);
    expect(result).toBe(value);
    expect(cache.get).toHaveBeenCalledWith(key);
  });

  it('should set a value in the cache', async () => {
    const key = 'testKey';
    const value = 'testValue';
    const ttl = 60;

    await service.set(key, value, ttl);
    expect(cache.set).toHaveBeenCalledWith(key, value, ttl);
  });

  it('should delete a value from the cache', async () => {
    const key = 'testKey';

    await service.delete(key);
    expect(cache.delete).toHaveBeenCalledWith(key);
  });
});
