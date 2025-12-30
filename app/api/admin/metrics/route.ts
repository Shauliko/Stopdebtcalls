import { NextResponse } from "next/server";
import { listOrders } from "@/lib/store";

export async function GET() {
  const orders = listOrders();
  const now = Date.now();

  const dayMs = 24 * 60 * 60 * 1000;

  const total = orders.length;

  const byStatus: Record<string, number> = {};
  let today = 0;
  let last7Days = 0;

  for (const o of orders) {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;

    const created = new Date(o.createdAt).getTime();
    if (now - created < dayMs) today++;
    if (now - created < dayMs * 7) last7Days++;
  }

  return NextResponse.json({
    ok: true,
    total,
    today,
    last7Days,
    byStatus,
  });
}
