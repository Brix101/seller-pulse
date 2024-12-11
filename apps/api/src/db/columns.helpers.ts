import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updatedAt: timestamp().defaultNow(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
};
