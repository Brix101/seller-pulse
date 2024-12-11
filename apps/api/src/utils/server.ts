import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext, createTRPCRouter, publicProcedure } from './trpc';
import { z } from 'zod';

const port = process.env.PORT || 5000;
const app = express();

export const appRouter = createTRPCRouter({
  getUser: publicProcedure.input(z.string()).query((opts) => {
    opts.input;
    return {
      id: opts.input,
      name: 'React',
    };
  }),
});

app.use(
  '/trpc',
  cors({
    maxAge: 86400,
    credentials: true,
    origin: '*',
  }),
  cookieParser(),
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

export async function initServer() {
  const server = app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });

  const signals = ['SIGINT', 'SIGTERM'] as const;
  const errors = ['uncaughtException', 'unhandledRejection'] as const;

  errors.forEach((error) => {
    process.on(error, (err) => {
      try {
        console.error(`process exit due to ${error}`);
        console.error(err);
        process.exit(1);
      } catch (_) {
        process.exit(1);
      }
    });
  });

  signals.forEach((signal) => {
    process.on(signal, () => {
      console.log(`Received ${signal}, exiting...`);
      console.log('Closing server...');
      server.close((err) => {
        console.log('Server closed');
        process.exit(err ? 1 : 0);
      });
    });
  });
}
