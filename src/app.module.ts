import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configSchema from './config/config.schema';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import mikroOrmConfig from './mikro-orm.config';
import { StoreModule } from './store/store.module';
import { ClientModule } from './client/client.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { ListingModule } from './listing/listing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local'],
      load: [configuration, databaseConfig, redisConfig],
      validate: (config) => configSchema.parse(config),
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    StoreModule,
    ClientModule,
    MarketplaceModule,
    ListingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
