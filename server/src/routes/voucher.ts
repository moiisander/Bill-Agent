import { db } from "#db/index.js";
import { vouchers } from "#db/schema.js";
import { publicProcedure, router } from "#trpc/trpc.js";
import { date, z } from "zod";

export const voucherRouter = router({
  list: publicProcedure.query(async () => {
    const result = await db.select().from(vouchers);
    return result;
  }),

  create: publicProcedure
    .input(
      z.object({
        voucherNumber: z.string(),
        date: z.string(),
        vendor: z.string(),
        amount: z.string(),
        status: z.string().default("draft"),
        data: z
          .object({
            description: z.string().optional(),
            account: z.string().optional(),
            approvedBy: z.string().optional(),
            supportingDocs: z.array(z.string()).optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(vouchers).values(input).returning();
      return result[0];
    }),
});
