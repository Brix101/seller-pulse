import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "../columns.helpers";

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  isActive: boolean().default(true),
  ...timestamps,
});
