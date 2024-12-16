import { z } from 'zod';

const databaseConfigSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().default('seller-pulse'),
});

const redisConfigSchema = z.object({
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_USER: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_SSL_ENABLED: z.boolean().default(false),
});

const configSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test', 'provision'])
      .default('development'),
    PORT: z.coerce.number().default(3000),
  })
  .merge(databaseConfigSchema)
  .merge(redisConfigSchema);

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
export type RedisConfig = z.infer<typeof redisConfigSchema>;
export type Config = z.infer<typeof configSchema>;

export default configSchema;
