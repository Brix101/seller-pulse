import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configSchema from './config/config.schema';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local'],
      load: [configuration, databaseConfig, redisConfig],
      validate: (config) => configSchema.parse(config),
      isGlobal: true,
    }),
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
