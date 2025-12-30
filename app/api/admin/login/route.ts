import { NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminSession,
  adminCookieOptions,
} from "@/lib/adminAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = String(body?.password ?? "");

  if (!password) {
    return NextResponse.json(
      { ok: false, errors: ["Password is required."] },
      { status: 400 }
    );
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { ok: false, errors: ["Invalid credentials."] },
      { status: 401 }
    );
  }

  const sessionToken = createAdminSession();
  const cookie = adminCookieOptions();

  const res = NextResponse.json({ ok: true });

  res.cookies.set(
    cookie.name,
    sessionToken,
    cookie
  );

  return res;
}
