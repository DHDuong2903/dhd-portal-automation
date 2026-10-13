import { describe, it, expect } from "vitest";
import { generateResetCode, RESET_CODE_LENGTH } from "./reset-code";

describe("generateResetCode", () => {
  it("always returns a zero-padded 6-digit numeric string", () => {
    for (let i = 0; i < 1000; i++) {
      const code = generateResetCode();
      expect(code).toHaveLength(RESET_CODE_LENGTH);
      expect(code).toMatch(/^\d{6}$/);
    }
  });
});
