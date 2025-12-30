import { NextResponse } from "next/server";
import { normalizeAndValidate } from "@/lib/validate";
import { createOrder, markPaid } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  // Expect { form, letterText }
  const validated = normalizeAndValidate(body?.form);
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, errors: validated.errors },
      { status: 400 }
    );
  }

  const letterText = String(body?.letterText ?? "").trim();
  if (!letterText) {
    return NextResponse.json(
      { ok: false, errors: ["letterText is required."] },
      { status: 400 }
    );
  }

  // 1) Create order
  const order = createOrder({
    form: validated.data,
    letterText,
  });

  // 2) DEV behavior: mark paid immediately
  // (Stripe will replace this later)
  markPaid(order.id);

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    status: "paid",
  });
}
