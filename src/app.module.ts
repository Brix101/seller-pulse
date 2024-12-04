import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import configSchema from './config/config.schema';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import { ListingModule } from './listing/listing.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { SaleModule } from './sale/sale.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, databaseConfig],
      validate: (config) => configSchema.parse(config),
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (configService) => ({
        ...configService.get('database'),
        entities: ['./dist/**/*.entity.js'],
        entitiesTs: ['./src/**/*.entity.ts'],
        debug: true,
        driver: PostgreSqlDriver,
      }),
      inject: [ConfigService],
    }),
    StoreModule,
    ClientModule,
    ListingModule,
    MarketplaceModule,
    SaleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
