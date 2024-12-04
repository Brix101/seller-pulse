import { z } from 'zod';

const configSchema = z.object({
  port: z.number().default(3000),
  database: z.object({
    host: z.string(),
    port: z.number().default(5432),
    username: z.string(),
    password: z.string(),
    name: z.string(),
  }),
});

export default configSchema;
