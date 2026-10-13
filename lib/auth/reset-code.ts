import { randomInt } from "node:crypto";
import { RESET_CODE_TTL_MINUTES } from "@/lib/mail/password-reset";

export const RESET_CODE_LENGTH = 6;
export const RESET_CODE_MAX_ATTEMPTS = 5;
export const RESET_CODE_TTL_MS = RESET_CODE_TTL_MINUTES * 60 * 1000;

// Cryptographically-random numeric code, zero-padded to a fixed length so it
// always renders as 6 digits (e.g. "004217").
export function generateResetCode(): string {
  const max = 10 ** RESET_CODE_LENGTH;
  return randomInt(0, max).toString().padStart(RESET_CODE_LENGTH, "0");
}
