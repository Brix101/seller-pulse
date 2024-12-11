import { createStoreSchema } from "@sellerpulse/schema";
import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { desc, isNull } from "drizzle-orm";
import express from "express";
import { z } from "zod";

import { stores } from "../db/schema/stores";
import { createContext, createTRPCRouter, publicProcedure } from "./trpc";

// const __dirname = import.meta.dirname;

const port = process.env.PORT ?? 5000;
const app = express();

export const appRouter = createTRPCRouter({
  getUser: publicProcedure.input(z.string()).query((opts) => {
    return {
      id: opts.input,
      name: "React",
    };
  }),
  getStores: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.stores.findMany({
      where: isNull(stores.deletedAt),
      columns: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: [desc(stores.createdAt)],
    });
  }),

  createStore: publicProcedure
    .input(createStoreSchema)
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Sample error: Operation timed out"));
        }, 5000);
      });

      const [store] = await ctx.db
        .insert(stores)
        .values({
          name: input.name,
          isActive: input.isActive,
        })
        .returning();

      return store;
    }),
});

app.use(
  "/trpc",
  cors({
    maxAge: 86400,
    credentials: true,
    origin: "*",
  }),
  cookieParser(),
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    onError(opts) {
      const { error } = opts;
      console.error("Error:", error);
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.log("Internal server error");
        // send to bug reporting
      }
    },
  }),
);

export type AppRouter = typeof appRouter;

export function initServer() {
  // console.log('about to migrate postgres');
  // await migrate(db, {
  //   migrationsFolder: path.join(__dirname, '../../drizzle'),
  // });
  // console.log('postgres migration complete');

  const server = app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });

  const signals = ["SIGINT", "SIGTERM"] as const;
  const errors = ["uncaughtException", "unhandledRejection"] as const;

  errors.forEach((error) => {
    process.on(error, (err) => {
      try {
        console.error(`process exit due to ${error}`);
        console.error(err);
        process.exit(1);
      } catch {
        process.exit(1);
      }
    });
  });

  signals.forEach((signal) => {
    process.on(signal, () => {
      console.log(`Received ${signal}, exiting...`);
      console.log("Closing server...");
      server.close((err) => {
        console.log("Server closed");
        process.exit(err ? 1 : 0);
      });
    });
  });
}
