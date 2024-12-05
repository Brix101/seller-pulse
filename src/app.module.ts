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
import { AmznModule } from './amzn/amzn.module';

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
        autoLoadEntities: true,
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
    AmznModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// implements NestModule, OnModuleInit {
//   constructor(private readonly orm: MikroORM) {}
//
//   async onModuleInit(): Promise<void> {
//     await this.orm.getMigrator().up();
//   }
//
//   // for some reason the auth middlewares in profile and article modules are fired before the request context one,
//   // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
//   // around this issue
//   configure(consumer: MiddlewareConsumer): void {
//     // consumer.apply(MikroOrmMiddleware).forRoutes('*');
//   }
// }
