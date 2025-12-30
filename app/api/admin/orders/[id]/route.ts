import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/store";

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

  return NextResponse.json({ ok: true, order });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json().catch(() => null);

  const order = updateOrder(
    id,
    {
      status: body?.status,
      notes: body?.notes,
    },
    "admin"
  );

  if (!order) {
    return NextResponse.json(
      { ok: false, errors: ["Order not found."] },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, order });
}
