import bcrypt from "bcryptjs";

// Cost factor for bcrypt. 12 is a sensible 2020s default: strong enough to be
// expensive for an attacker, fast enough (~250ms) for interactive sign-up.
const SALT_ROUNDS = 12;

// bcrypt silently truncates input beyond 72 bytes, so callers must reject
// longer passwords at validation time (see registerSchema) — not here.
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
