import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

// CSRF guard: a random value stored in a cookie and echoed back as the OAuth
// `state`, verified on callback.
export const GOOGLE_STATE_COOKIE = "google_oauth_state";

// Step 1 of Google sign-in: redirect the browser to Google's consent screen.
export async function GET(request: Request) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Đăng nhập Google chưa được cấu hình." },
      { status: 503 },
    );
  }

  const origin = new URL(request.url).origin;
  const state = crypto.randomBytes(16).toString("hex");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", `${origin}/api/auth/google/callback`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 600, // 10 minutes to complete the consent flow
  });
  return response;
}
