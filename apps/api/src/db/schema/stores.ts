import { boolean, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from '../columns.helpers';

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  isActive: boolean('is_active').default(true),
  ...timestamps,
});
