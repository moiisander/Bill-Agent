import { trpc } from "../utils/trpc";

export default function StartPage() {
  const { data, error, isLoading } = trpc.voucher.list.useQuery()

  if (error) return <div>Error</div>;
  if (isLoading) return <div>Loading</div>;

  if (data?.[1])
    return <div>{data?.[1].voucherNumber ?? "no users"}</div>;

  return <div>undefined</div>
}