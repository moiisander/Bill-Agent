import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

export type Context = Awaited<ReturnType<typeof createContext>>;