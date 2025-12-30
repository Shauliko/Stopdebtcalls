import { NextResponse } from "next/server";
import { listOrders } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q")?.toLowerCase() || "";
  const status = searchParams.get("status") || "";

  const limitRaw = Number(searchParams.get("limit"));
  const offsetRaw = Number(searchParams.get("offset"));

  const limit = Math.min(
    Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 25,
    100
  );
  const offset =
    Number.isFinite(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0;

  let orders = listOrders();

  // Free-text search
  if (q) {
    orders = orders.filter((o) => {
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.collectorName?.toLowerCase().includes(q)
      );
    });
  }

  // Status filter
  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  const total = orders.length;
  const page = orders.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return NextResponse.json({
    ok: true,
    total,
    limit,
    offset,
    hasMore,
    orders: page.map((o) => ({
      id: o.id,
      status: o.status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      customerEmail: o.customerEmail,
      collectorName: o.collectorName,
      trackingNumber: o.trackingNumber,
      notes: o.notes,
    })),
  });
}
