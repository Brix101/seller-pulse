import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmznModule } from './amzn/amzn.module';
import { ClientModule } from './client/client.module';
import configSchema from './config/config.schema';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import { HealthModule } from './health/health.module';
import { ListingModule } from './listing/listing.module';
import { LwaModule } from './lwa/lwa.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import mikroOrmConfig from './mikro-orm.config';
import { SaleModule } from './sale/sale.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [configuration, databaseConfig],
      validate: (config) => configSchema.parse(config),
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    CacheModule.register({
      isGlobal: true,
    }),
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
export class AppModule {}
