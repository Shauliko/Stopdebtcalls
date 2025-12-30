import crypto from "crypto";

/* ================================
   Config
================================ */

const COOKIE_NAME = "sc_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

if (!ADMIN_PASSWORD || !SESSION_SECRET) {
  throw new Error(
    "Missing ADMIN_PASSWORD or ADMIN_SESSION_SECRET env variables"
  );
}

/* ================================
   Types
================================ */

type AdminSessionPayload = {
  iat: number;
  exp: number;
};

/* ================================
   Helpers
================================ */

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(data: string) {
  return base64url(
    crypto.createHmac("sha256", SESSION_SECRET!).update(data).digest()
  );
}

/* ================================
   Public API
================================ */

export function verifyAdminPassword(password: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(password),
    Buffer.from(ADMIN_PASSWORD!)
  );
}

export function createAdminSession(): string {
  const now = Date.now();

  const payload: AdminSessionPayload = {
    iat: now,
    exp: now + SESSION_TTL_MS,
  };

  const payloadStr = base64url(JSON.stringify(payload));
  const signature = sign(payloadStr);

  return `${payloadStr}.${signature}`;
}

export function verifyAdminSession(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadStr, signature] = parts;

  const expectedSig = sign(payloadStr);
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  )) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadStr, "base64").toString("utf8")
    ) as AdminSessionPayload;

    if (Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/* ================================
   Cookie helper
================================ */

export function adminCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}
