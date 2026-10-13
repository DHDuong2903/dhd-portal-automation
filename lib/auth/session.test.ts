import { describe, it, expect } from "vitest";
import { signSession, verifySession } from "./session";

describe("session token", () => {
  it("round-trips a user id", () => {
    const token = signSession("user_123");
    expect(verifySession(token)).toBe("user_123");
  });

  it("rejects a tampered payload", () => {
    const token = signSession("user_123");
    const [, signature] = token.split(".");
    const forged = `${Buffer.from(
      JSON.stringify({ uid: "attacker", exp: 9999999999 }),
    ).toString("base64url")}.${signature}`;
    expect(verifySession(forged)).toBeNull();
  });

  it("rejects an expired token", () => {
    const expired = signSession("user_123", -10);
    expect(verifySession(expired)).toBeNull();
  });

  it("rejects malformed input", () => {
    expect(verifySession(undefined)).toBeNull();
    expect(verifySession("")).toBeNull();
    expect(verifySession("not-a-token")).toBeNull();
  });
});
