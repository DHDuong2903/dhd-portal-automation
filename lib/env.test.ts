import { describe, expect, it } from "vitest";
import { parseEnv } from "@/lib/env";

const validUrl = "postgresql://portal:portal@localhost:5433/portal_automation";

describe("parseEnv", () => {
  it("accepts a valid configuration", () => {
    const env = parseEnv({ DATABASE_URL: validUrl });
    expect(env.DATABASE_URL).toBe(validUrl);
    expect(env.NODE_ENV).toBe("development");
  });

  it("throws a clear error when DATABASE_URL is missing", () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });

  it("throws when DATABASE_URL is not a URL", () => {
    expect(() => parseEnv({ DATABASE_URL: "not-a-url" })).toThrow(
      /valid connection URL/,
    );
  });
});
