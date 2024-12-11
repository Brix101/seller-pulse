import 'dotenv/config';

import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { initServer, appRouter } from './utils/server';

void initServer();

type AppRouter = typeof appRouter;

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export type { AppRouter, RouterInputs, RouterOutputs };
