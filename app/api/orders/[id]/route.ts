import { NextResponse } from "next/server";
import { getOrder } from "@/lib/store";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const order = getOrder(id);

  if (!order) {
    return NextResponse.json(
      { ok: false, errors: ["Order not found."] },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    order: {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingNumber: order.trackingNumber,
      customerEmail: order.customerEmail,
      collectorName: order.collectorName,
      notes: order.notes,
      events: order.events,
    },
  });
}
