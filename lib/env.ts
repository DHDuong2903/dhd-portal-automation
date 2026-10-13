import { z } from "zod";

// Empty env vars (e.g. SMTP_USER="") should read as "unset" rather than failing
// a non-empty string check — common when keys are present but left blank.
const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

// Dev/test fallback so the app runs out of the box. Production must override it
// (enforced below) — a known secret would let anyone forge a session cookie.
export const DEV_SESSION_SECRET = "dev-insecure-session-secret-change-me";

// Fail fast with a clear message when configuration is missing or malformed,
// rather than surfacing an opaque connection error deep in a request.
const envSchema = z
  .object({
    DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection URL"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // HMAC key used to sign session cookies.
    SESSION_SECRET: z
      .string()
      .min(16, "SESSION_SECRET must be at least 16 characters")
      .default(DEV_SESSION_SECRET),

    // SMTP for outgoing mail (e.g. password-reset OTP). All optional: when
    // host/user/pass are absent the mailer falls back to logging to the
    // console, so the app runs out of the box in development.
    SMTP_HOST: optionalString,
    SMTP_PORT: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().positive().default(465),
    ),
    SMTP_USER: optionalString,
    SMTP_PASS: optionalString,
    // Envelope "From". Falls back to SMTP_USER when omitted.
    MAIL_FROM: optionalString,

    // Google OAuth (sign-in with Google). Optional: when absent the Google
    // button returns a "not configured" error instead of starting the flow.
    GOOGLE_CLIENT_ID: optionalString,
    GOOGLE_CLIENT_SECRET: optionalString,
  })
  .superRefine((value, ctx) => {
    if (
      value.NODE_ENV === "production" &&
      value.SESSION_SECRET === DEV_SESSION_SECRET
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["SESSION_SECRET"],
        message: "SESSION_SECRET must be set to a unique value in production",
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return result.data;
}

export const env = parseEnv(process.env);
