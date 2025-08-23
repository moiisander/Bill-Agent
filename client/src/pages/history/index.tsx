import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "../../../../server/src/trpc/router";
import { trpc } from "../../utils/trpc";
import InvoiceVoucherTabs from "./invoice-voucher-tabs";
import { useEffect, useState } from "react";

type InvoiceVoucherData = inferProcedureOutput<AppRouter["voucher"]["list"]>;
export type InvoiceVoucherItem = InvoiceVoucherData[number];

export default function HistoryPage() {
    const [invoiceVoucher, setInvoiceVoucher] = useState<InvoiceVoucherItem>();
    const { data, error, isLoading } = trpc.voucher.list.useQuery();

    useEffect(() => {
        if (!isLoading && data && data.length > 0) {
            setInvoiceVoucher(data[0]);
        }
    }, [isLoading, data]);

    return (
        <div className="max-w-7xl p-4">
            <h1 className="text-3xl font-bold text-foreground mb-6">
                Invoice & Voucher History
            </h1>

            {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                    Error loading invoice history
                </div>
            )}

            {isLoading && (
                <div className="rounded-lg border bg-muted p-4 text-muted-foreground">
                    Loading invoice history...
                </div>
            )}

            {data && invoiceVoucher && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <ul className="p-2 bg-card border max-w-xs rounded-lg col-span-4 h-fit">
                        {data.map((iv) => (
                            <li
                                onClick={() => setInvoiceVoucher(iv)}
                                key={iv.voucher.id}
                                className={`${
                                    invoiceVoucher?.voucher.id === iv.voucher.id
                                        ? "bg-muted"
                                        : null
                                } flex justify-between transition-colors dark:hover:bg-primary/20 py-2 px-3 rounded items-center`}
                            >
                                <span>{iv.voucher?.invoiceNumber}</span>
                                <span>
                                    {iv.voucher?.createdAt.toDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="col-span-8">
                        <InvoiceVoucherTabs data={invoiceVoucher} />
                    </div>
                </div>
            )}
        </div>
    );
}
