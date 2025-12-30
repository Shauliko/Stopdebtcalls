import { NextResponse } from "next/server";
import { lob } from "@/lib/lob";

export async function POST(req: Request) {
  const body = await req.json();

  // DEV MODE: do not hard-block on Lob
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({
      ok: true,
      deliverability: "skipped_dev_mode",
    });
  }

  // PRODUCTION MODE ONLY
  try {
    const verification = await lob.usVerifications.verify({
      primary_line: body.addressLine1,
      secondary_line: body.addressLine2 || undefined,
      city: body.city,
      state: body.state,
      zip_code: body.zip,
    });

    if (verification.deliverability !== "deliverable") {
      return NextResponse.json({
        ok: false,
        error:
          "Address could not be verified as deliverable. Please double-check the address.",
      });
    }

    return NextResponse.json({
      ok: true,
      deliverability: verification.deliverability,
      normalized: verification.components,
    });
  } catch (err) {
    console.error("Address verification error:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not verify this address. Please check for typos or try another address.",
      },
      { status: 400 }
    );
  }
}
