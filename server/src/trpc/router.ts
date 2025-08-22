import { voucherRouter } from "#routes/voucher.js";
import { invoiceRouter } from "#routes/invoice.js";
import { router } from "./trpc.js";

export const appRouter = router({
  voucher: voucherRouter,
  invoice: invoiceRouter,
});

export type AppRouter = typeof appRouter;