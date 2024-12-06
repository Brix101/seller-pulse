import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/postgresql';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { AmznModule } from './amzn/amzn.module';
import { ClientModule } from './client/client.module';
import configSchema from './config/config.schema';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import { HealthModule } from './health/health.module';
import { ListingModule } from './listing/listing.module';
import { LwaModule } from './lwa/lwa.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import mikroOrmConfig from './mikro-orm.config';
import { SaleModule } from './sale/sale.module';
import { StoreModule } from './store/store.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [configuration, databaseConfig, redisConfig],
      validate: (config) => configSchema.parse(config),
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    CacheModule.registerAsync({
      useFactory: async (configService) => {
        const redisConfig = configService.get('redis');

        const store = await redisStore(redisConfig);

        return {
          store: store as unknown as CacheStore,
          ttl: 60 * 60000, // 3 minutes (milliseconds)
        };
      },
      isGlobal: true,
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: configService.get('redis'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    StoreModule,
    ClientModule,
    ListingModule,
    MarketplaceModule,
    SaleModule,
    AmznModule,
    HealthModule,
    LwaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  //, OnModuleInit{
  // constructor(private readonly orm: MikroORM) {}
  //
  // async onModuleInit() {
  //   await this.orm.getMigrator().up();
  // }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
