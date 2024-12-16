import KeyvRedis from '@keyv/redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        const secondary = new KeyvRedis(redisConfig);

        return new Cacheable({ secondary, ttl: '4h' });
      },
      inject: [ConfigService], // Ensure ConfigService is injected
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
