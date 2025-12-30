import { NextResponse } from "next/server";
import { adminCookieOptions } from "@/lib/adminAuth";

export async function POST() {
  const cookie = adminCookieOptions();

  const res = NextResponse.json({ ok: true });

  res.cookies.set(
    cookie.name,
    "",
    {
      ...cookie,
      maxAge: 0,
    }
  );

  return res;
}
