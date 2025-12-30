import { NextResponse } from "next/server";
import { getOrder } from "@/lib/store";

export async function POST(
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

  if (order.status === "canceled") {
    return NextResponse.json(
      { ok: false, errors: ["Order is canceled."] },
      { status: 409 }
    );
  }

  // Force resend by resetting state to paid
  order.status = "paid";
  order.trackingNumber = undefined;
  order.lobLetterId = undefined;
  order.lobMailingId = undefined;

  return NextResponse.json({
    ok: true,
    order,
    message: "Order reset to paid. Sending will re-trigger.",
  });
}
