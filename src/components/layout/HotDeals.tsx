// app/(home)/layout/HotDeals.tsx or wherever this lives

import { ReviewService } from "@/services/hotDeal.service";
import HotDealsSection from "../HotDeals";

export const dynamic = "force-dynamic";

export default async function HotDealsPage() {
  const { data, error } = await ReviewService.getHotDeals();

  return <HotDealsSection initialDeals={data || []} />;
}
