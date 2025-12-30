import { NextResponse } from "next/server";
import { normalizeAndValidate } from "@/lib/validate";
import { renderCeaseCommunicationLetter } from "@/lib/letterTemplates";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const validated = normalizeAndValidate(body);

  if (!validated.ok) {
    return NextResponse.json({ ok: false, errors: validated.errors }, { status: 400 });
  }

  const letterText = renderCeaseCommunicationLetter(validated.data);

  return NextResponse.json({
    ok: true,
    form: validated.data,
    letterText,
  });
}
