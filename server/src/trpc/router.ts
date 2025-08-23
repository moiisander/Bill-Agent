import { voucherRouter } from "#routes/voucher.js";
import { router } from "./trpc.js";

export const appRouter = router({
  voucher: voucherRouter,
});

export type AppRouter = typeof appRouter;