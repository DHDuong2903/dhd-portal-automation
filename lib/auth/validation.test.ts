import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  requestResetSchema,
  resetPasswordSchema,
  changePasswordSchema,
  PASSWORD_MIN,
  PASSWORD_MAX,
} from "./validation";

describe("registerSchema", () => {
  const valid = {
    name: "Dương Huy",
    email: "huy@example.com",
    password: "secret12",
  };

  it("accepts a well-formed registration", () => {
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("trims the name and lowercases the email", () => {
    const result = registerSchema.parse({
      ...valid,
      name: "  Dương Huy  ",
      email: "  Huy@Example.COM ",
    });
    expect(result.name).toBe("Dương Huy");
    expect(result.email).toBe("huy@example.com");
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a blank name", () => {
    const result = registerSchema.safeParse({ ...valid, name: "   " });
    expect(result.success).toBe(false);
  });

  it(`rejects passwords shorter than ${PASSWORD_MIN} characters`, () => {
    const result = registerSchema.safeParse({ ...valid, password: "a".repeat(PASSWORD_MIN - 1) });
    expect(result.success).toBe(false);
  });

  it(`rejects passwords longer than ${PASSWORD_MAX} characters`, () => {
    const result = registerSchema.safeParse({ ...valid, password: "a".repeat(PASSWORD_MAX + 1) });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("normalizes the email and accepts any non-empty password", () => {
    const result = loginSchema.parse({
      email: "  Huy@Example.COM ",
      password: "x",
    });
    expect(result.email).toBe("huy@example.com");
    expect(result.password).toBe("x");
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ email: "huy@example.com", password: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ email: "nope", password: "x" });
    expect(result.success).toBe(false);
  });
});

describe("requestResetSchema", () => {
  it("normalizes the email", () => {
    const result = requestResetSchema.parse({ email: "  Huy@Example.COM " });
    expect(result.email).toBe("huy@example.com");
  });

  it("rejects an invalid email", () => {
    expect(requestResetSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  const valid = {
    email: "huy@example.com",
    code: "012345",
    password: "secret12",
  };

  it("accepts a 6-digit code with a valid password", () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects codes that are not exactly 6 digits", () => {
    expect(resetPasswordSchema.safeParse({ ...valid, code: "123" }).success).toBe(
      false,
    );
    expect(
      resetPasswordSchema.safeParse({ ...valid, code: "1234567" }).success,
    ).toBe(false);
    expect(
      resetPasswordSchema.safeParse({ ...valid, code: "abcdef" }).success,
    ).toBe(false);
  });

  it(`rejects passwords shorter than ${PASSWORD_MIN} characters`, () => {
    expect(
      resetPasswordSchema.safeParse({
        ...valid,
        password: "a".repeat(PASSWORD_MIN - 1),
      }).success,
    ).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts a non-empty current password and a valid new password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "x",
      newPassword: "secret12",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a blank current password", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "",
        newPassword: "secret12",
      }).success,
    ).toBe(false);
  });

  it(`rejects a new password shorter than ${PASSWORD_MIN} characters`, () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "x",
        newPassword: "a".repeat(PASSWORD_MIN - 1),
      }).success,
    ).toBe(false);
  });
});
