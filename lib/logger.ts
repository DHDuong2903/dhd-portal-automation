// Structured logging with secret redaction. Credentials and customer data
// must never reach logs (North Star §4 / MVP §6.3), so every metadata object
// is scrubbed before it is written.

const SENSITIVE_KEY = /(pass(word)?|token|secret|credential|authorization|auth|api[-_]?key|cookie|session)/i;
const REDACTED = "[REDACTED]";

type Meta = Record<string, unknown>;
type Level = "info" | "warn" | "error";

export function redact(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  if (Array.isArray(value)) return value.map((v) => redact(v, seen));

  const out: Meta = {};
  for (const [key, val] of Object.entries(value as Meta)) {
    out[key] = SENSITIVE_KEY.test(key) ? REDACTED : redact(val, seen);
  }
  return out;
}

function write(level: Level, message: string, meta?: Meta): void {
  const entry = {
    level,
    time: new Date().toISOString(),
    message,
    ...(meta ? { meta: redact(meta) } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message: string, meta?: Meta) => write("info", message, meta),
  warn: (message: string, meta?: Meta) => write("warn", message, meta),
  error: (message: string, meta?: Meta) => write("error", message, meta),
};
