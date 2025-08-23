import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InvoiceVoucherItem } from ".";
import { InvoiceCard } from "@/components/invoice-card";
import { VoucherCard } from "@/components/voucher-card";

interface InvoiceVoucherTabsProps {
    data: InvoiceVoucherItem;
}

export default function InvoiceVoucherTabs({ data }: InvoiceVoucherTabsProps) {
    const invoice = data.invoice;
    const voucher = data.voucher;
    const file = data.file;

    return (
        <Tabs defaultValue="voucher">
            <TabsList>
                <TabsTrigger value="voucher">Voucher</TabsTrigger>
                <TabsTrigger value="invoice">Invoice</TabsTrigger>
            </TabsList>
            <TabsContent value="voucher">
                <VoucherCard voucherData={voucher} />
            </TabsContent>
            <TabsContent value="invoice">
                <InvoiceCard invoiceData={invoice} fileData={file} />
            </TabsContent>
        </Tabs>
    );
}
