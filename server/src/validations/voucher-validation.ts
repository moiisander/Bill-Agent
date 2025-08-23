import { z } from "zod";

export const extractedVoucherLineSchema = z.object({
    accountCode: z
        .string({
            required_error: "Account code is required",
        })
        .nullable(),
    description: z
        .string({
            required_error: "Description is required",
        })
        .nullable(),
    debit: z.number({
        required_error: "Debit is required",
        invalid_type_error: "Debit must be a number",
    }),
    credit: z.number({
        required_error: "Credit is required",
        invalid_type_error: "Credit must be a number",
    }),
});

export const extractedVoucherSchema = z.object({
    accountClassification: z
        .string({
            required_error: "Account classification is required",
        })
        .nullable(),
    expenseCategory: z
        .string({
            required_error: "Expense category is required",
        })
        .nullable(),
    taxTreatment: z.string({
        required_error: "Tax treatment is required",
    }),
    complianceNotes: z
        .array(
            z.string({
                required_error: "Compliance note must be a string",
            })
        )
        .nullable(),
    voucherLines: z
        .array(extractedVoucherLineSchema, {
            required_error: "Voucher lines are required",
        })
        .nonempty("At least one voucher line is required"),
});
