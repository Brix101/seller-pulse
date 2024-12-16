import * as dotenv from 'dotenv';

import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';
import { Client } from './client/entities/client.entity';
import { BaseEntity } from './common/entities/base.entity';
import { Listing } from './listing/entities/listing.entity';
import { Marketplace } from './marketplace/entities/marketplace.entity';
import { Store } from './store/entities/store.entity';

dotenv.config({
  path: ['.env', '.env.development.local'],
});

const logger = new Logger('MikroORM');

export default defineConfig({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: [Store, Client, Marketplace, Listing, BaseEntity],
  debug: process.env.NODE_ENV !== 'production',
  driver: PostgreSqlDriver,
  highlighter: new SqlHighlighter(),
  logger: logger.log.bind(logger),
});
