import express from "express";
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from "#trpc/router.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// tRPC routes
app.use(
  "/",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
