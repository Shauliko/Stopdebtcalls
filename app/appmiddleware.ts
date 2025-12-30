import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";

const ADMIN_PATHS = ["/admin", "/api/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPath = ADMIN_PATHS.some((p) =>
    pathname === p || pathname.startsWith(p + "/")
  );

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get("sc_admin")?.value;

  if (!sessionCookie) {
    return redirectToLogin(req);
  }

  const valid = verifyAdminSession(sessionCookie);
  if (!valid) {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
