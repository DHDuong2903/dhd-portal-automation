import { describe, expect, it } from "vitest";
import { redact } from "@/lib/logger";

describe("redact", () => {
  it("masks sensitive keys at any depth", () => {
    const out = redact({
      email: "a@b.com",
      password: "hunter2",
      crm: { apiKey: "sk-123", nested: { token: "t", name: "ok" } },
    }) as Record<string, unknown>;

    expect(out.email).toBe("a@b.com");
    expect(out.password).toBe("[REDACTED]");
    const crm = out.crm as Record<string, unknown>;
    expect(crm.apiKey).toBe("[REDACTED]");
    const nested = crm.nested as Record<string, unknown>;
    expect(nested.token).toBe("[REDACTED]");
    expect(nested.name).toBe("ok");
  });

  it("redacts secrets inside arrays", () => {
    const out = redact([{ authorization: "Bearer x" }, { id: 1 }]) as Array<
      Record<string, unknown>
    >;
    expect(out[0].authorization).toBe("[REDACTED]");
    expect(out[1].id).toBe(1);
  });

  it("handles circular references without throwing", () => {
    const a: Record<string, unknown> = { name: "ok" };
    a.self = a;
    const out = redact(a) as Record<string, unknown>;
    expect(out.name).toBe("ok");
    expect(out.self).toBe("[Circular]");
  });
});
