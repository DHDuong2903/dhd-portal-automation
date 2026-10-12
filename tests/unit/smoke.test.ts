import { describe, expect, it } from "vitest";

// Smoke test: proves the Vitest runner, TS transform and the `@/*` path
// alias all resolve. Replaced by real domain tests as epics land.
describe("test harness", () => {
  it("runs vitest", () => {
    expect(1 + 1).toBe(2);
  });

  it("resolves the @/ path alias", async () => {
    const mod = await import("@/lib/db");
    expect(mod.db).toBeDefined();
  });
});
