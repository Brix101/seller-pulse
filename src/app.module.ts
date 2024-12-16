import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';
import { ClientModule } from './client/client.module';
import configSchema from './config/config.schema';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import { ListingModule } from './listing/listing.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import mikroOrmConfig from './mikro-orm.config';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local'],
      load: [configuration, databaseConfig, redisConfig],
      validate: (config) => configSchema.parse(config),
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    CacheModule,
    StoreModule,
    ClientModule,
    MarketplaceModule,
    ListingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
