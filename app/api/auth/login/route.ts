import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/auth/validation";
import { verifyPassword } from "@/lib/auth/password";
import {
  signSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth/session";

// Precomputed bcrypt hash. When the email is unknown we still run a comparison
// against this so response time doesn't reveal whether an account exists.
const TIMING_GUARD_HASH =
  "$2b$12$fcV8j5BQxLIGXJLG6W01e.TXe9zshtWn45BJI8n4J/mj8G8DYMRAe";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email hoặc mật khẩu không đúng." },
      { status: 401 },
    );
  }

  const { email, password } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });

  const passwordOk = await verifyPassword(
    password,
    user?.passwordHash ?? TIMING_GUARD_HASH,
  );

  // One generic message for both "no such email" and "wrong password" — never
  // tell the caller which half failed.
  if (!user || !passwordOk) {
    return NextResponse.json(
      { error: "Email hoặc mật khẩu không đúng." },
      { status: 401 },
    );
  }

  const response = NextResponse.json(
    { id: user.id, name: user.name, email: user.email },
    { status: 200 },
  );
  response.cookies.set(SESSION_COOKIE, signSession(user.id), sessionCookieOptions);
  return response;
}
