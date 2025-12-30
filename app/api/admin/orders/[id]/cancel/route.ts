import { NextResponse } from "next/server";
import { cancelOrder, getOrder } from "@/lib/store";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json().catch(() => null);

  const reason = body?.reason
    ? String(body.reason).trim()
    : "Canceled by admin";

  const existing = getOrder(id);
  if (!existing) {
    return NextResponse.json(
      { ok: false, errors: ["Order not found."] },
      { status: 404 }
    );
  }

  if (existing.status === "canceled") {
    return NextResponse.json({
      ok: true,
      order: existing,
    });
  }

  const order = cancelOrder(id, reason);
  if (!order) {
    return NextResponse.json(
      { ok: false, errors: ["Unable to cancel order."] },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, order });
}
