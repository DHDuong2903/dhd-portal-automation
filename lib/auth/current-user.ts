import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

export type SessionUser = { id: string; name: string | null; email: string };

// Reads the session cookie and resolves the current user, or null when there is
// no valid session. Server-only (uses next/headers).
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const userId = verifySession(store.get(SESSION_COOKIE)?.value);
  if (!userId) return null;

  return db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
}
