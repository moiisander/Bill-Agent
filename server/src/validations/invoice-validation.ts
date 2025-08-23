import { z } from "zod";

const extractedInvoiceLineItemSchema = z.object({
    description: z.string().min(1, "Description is required").nullable(),
    quantity: z.number({ invalid_type_error: "Quantity must be a number" }),
    unitPrice: z.number({ invalid_type_error: "Unit price must be a number" }),
    amount: z.number({ invalid_type_error: "Amount must be a number" }),
});

export const extractedInvoiceSchema = z.object({
    vendorName: z
        .string({ message: "Vendor name is required" })
        .min(1, "Vendor name is required"),
    vendorAddress: z.string().nullable(),
    invoiceNumber: z.string({ message: "Invoice number is required" }),
    invoiceDate: z
        .string({ message: "Invoice date is required" })
        .refine((val) => !isNaN(Date.parse(val)), "Invoice date must be valid"),
    dueDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Due date must be valid"),
    subtotal: z.number({ invalid_type_error: "Subtotal must be a number" }),
    taxAmount: z.number({ invalid_type_error: "Tax amount must be a number" }).nullable(),
    totalAmount: z.number({
        invalid_type_error: "Total amount must be a number",
    }),
    lineItems: z
        .array(extractedInvoiceLineItemSchema)
        .min(1, "At least one line item is required"),
});
