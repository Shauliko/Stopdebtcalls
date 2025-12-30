import { NextResponse } from "next/server";
import {
  getOrder,
  markSent,
  failOrder,
} from "@/lib/store";
import { lob } from "@/lib/lob";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const orderId = String(body?.orderId ?? "").trim();

  if (!orderId) {
    return NextResponse.json(
      { ok: false, errors: ["orderId is required."] },
      { status: 400 }
    );
  }

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json(
      { ok: false, errors: ["Order not found."] },
      { status: 404 }
    );
  }

  // Hard stop conditions
  if (order.status === "canceled") {
    return NextResponse.json(
      { ok: false, errors: ["Order is canceled."] },
      { status: 409 }
    );
  }

  // Idempotency: already sent
  if (order.status === "sent" && order.trackingNumber) {
    return NextResponse.json({
      ok: true,
      orderId,
      status: order.status,
      trackingNumber: order.trackingNumber,
    });
  }

  // Only paid orders can be sent
  if (order.status !== "paid") {
    return NextResponse.json(
      {
        ok: false,
        errors: [`Order not sendable in status: ${order.status}`],
      },
      { status: 409 }
    );
  }

  try {
    // ================================
    // DEV MODE SHORT-CIRCUIT
    // ================================
    if (process.env.NODE_ENV !== "production") {
      const fakeTracking = `DEV-${order.id.slice(0, 8)}`;

      const updated = markSent(orderId, fakeTracking, {
        lobLetterId: "dev-letter",
        lobMailingId: "dev-mailing",
      });

      return NextResponse.json({
        ok: true,
        orderId,
        status: updated?.status,
        trackingNumber: fakeTracking,
      });
    }

    // ================================
    // PRODUCTION — LOB SEND
    // ================================
    const letter = await lob.letters.create({
      to: {
        name: order.form.collectorName,
        address_line1: order.form.collectorAddress || "Unknown address",
        address_city: "N/A",
        address_state: "N/A",
        address_zip: "00000",
        address_country: "US",
      },
      from: {
        name: order.form.fullName,
        address_line1: order.form.addressLine1,
        address_line2: order.form.addressLine2,
        address_city: order.form.city,
        address_state: order.form.state,
        address_zip: order.form.zip,
        address_country: "US",
      },
      file: order.letterText,
      color: false,
      double_sided: false,
      mail_type: "certified",
    });

    const trackingNumber =
      // @ts-ignore – Lob SDK inconsistency
      letter?.tracking_number || `LOB-${letter.id}`;

    const updated = markSent(orderId, trackingNumber, {
      lobLetterId: letter.id,
      lobMailingId: letter?.mailing_id,
    });

    return NextResponse.json({
      ok: true,
      orderId,
      status: updated?.status,
      trackingNumber,
    });
  } catch (err: any) {
    console.error("Lob send error:", err);

    failOrder(orderId, err?.message || "Unknown Lob error");

    return NextResponse.json(
      { ok: false, errors: ["Failed to send letter."] },
      { status: 500 }
    );
  }
}
