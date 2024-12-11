import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string(),
  isActive: z.boolean().default(true),
});
