import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { env } from "@/lib/env";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import {
  signSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { GOOGLE_STATE_COOKIE } from "../route";

interface GoogleUserInfo {
  email?: string;
  email_verified?: boolean;
  name?: string;
}

// Step 2 of Google sign-in: validate the callback, resolve the account (linking
// by email), and issue the standard session cookie.
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/?auth_error=${reason}`);

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return fail("google_unconfigured");
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get(GOOGLE_STATE_COOKIE)?.value;

  // Reject if state is missing or doesn't match the one we issued (CSRF).
  if (!code || !state || !cookieState || state !== cookieState) {
    return fail("google_state");
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return fail("google_token");

  const tokens = (await tokenRes.json()) as { access_token?: string };
  if (!tokens.access_token) return fail("google_token");

  const infoRes = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    { headers: { Authorization: `Bearer ${tokens.access_token}` } },
  );
  if (!infoRes.ok) return fail("google_userinfo");

  const info = (await infoRes.json()) as GoogleUserInfo;
  if (!info.email || info.email_verified === false) {
    return fail("google_email");
  }

  const email = info.email.toLowerCase();
  const userId = await resolveUser(email, info.name ?? null);

  const response = NextResponse.redirect(`${origin}/`);
  response.cookies.set(SESSION_COOKIE, signSession(userId), sessionCookieOptions);
  response.cookies.delete(GOOGLE_STATE_COOKIE);
  return response;
}

// Links to an existing account by email, or creates one. Google-created users
// get a random (unusable) password hash; they can set a real password later via
// the "forgot password" flow.
async function resolveUser(
  email: string,
  name: string | null,
): Promise<string> {
  const existing = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) return existing.id;

  const randomHash = await hashPassword(crypto.randomBytes(32).toString("hex"));
  try {
    const created = await db.user.create({
      data: { email, name, passwordHash: randomHash },
      select: { id: true },
    });
    return created.id;
  } catch (error) {
    // P2002 = a concurrent request created the same email first; re-read it.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const raced = await db.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (raced) return raced.id;
    }
    throw error;
  }
}
