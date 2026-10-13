import crypto from "node:crypto";
import { env } from "@/lib/env";

export const SESSION_COOKIE = "portal_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

// Stateless signed-cookie session: `base64url(payload).base64url(hmac)`.
// No DB table — the HMAC guarantees the payload (user id + expiry) is untampered.
function sign(payload: string): string {
  return crypto
    .createHmac("sha256", env.SESSION_SECRET)
    .update(payload)
    .digest("base64url");
}

export function signSession(
  userId: string,
  maxAgeSec: number = SESSION_MAX_AGE,
): string {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSec;
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp })).toString(
    "base64url",
  );
  return `${payload}.${sign(payload)}`;
}

// Returns the user id if the token is well-formed, correctly signed and not
// expired; otherwise null. Signature check is constant-time.
export function verifySession(token: string | undefined | null): string | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    ) as { uid?: unknown; exp?: unknown };

    if (typeof data.uid !== "string" || typeof data.exp !== "number") {
      return null;
    }
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return data.uid;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
