import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { stores } from './schema/stores';

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://localhost:5432/portgres';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export default drizzle(client, {
  logger: true,
  casing: 'snake_case',
  schema: {
    stores,
  },
});
