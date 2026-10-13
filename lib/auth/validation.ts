import { z } from "zod";

// bcrypt only hashes the first 72 bytes of input; anything longer would be
// silently ignored, so we cap the password here to keep the stored hash honest.
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập họ tên")
    .max(100, "Họ tên quá dài (tối đa 100 ký tự)"),
  // Normalize to lowercase so uniqueness is case-insensitive at the app layer.
  email: z
    .string()
    .trim()
    .pipe(z.email("Email không hợp lệ"))
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(PASSWORD_MIN, `Mật khẩu tối thiểu ${PASSWORD_MIN} ký tự`)
    .max(PASSWORD_MAX, `Mật khẩu tối đa ${PASSWORD_MAX} ký tự`),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Login only needs a well-formed email and a non-empty password — length rules
// belong to registration. The email is normalized the same way for lookup.
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email("Email không hợp lệ"))
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginInput = z.infer<typeof loginSchema>;

const normalizedEmail = z
  .string()
  .trim()
  .pipe(z.email("Email không hợp lệ"))
  .transform((value) => value.toLowerCase());

// Step 1 of password reset: request an OTP for an email.
export const requestResetSchema = z.object({ email: normalizedEmail });

export type RequestResetInput = z.infer<typeof requestResetSchema>;

// Step 2: submit the OTP plus a new password.
export const resetPasswordSchema = z.object({
  email: normalizedEmail,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Mã xác thực gồm 6 chữ số"),
  password: z
    .string()
    .min(PASSWORD_MIN, `Mật khẩu tối thiểu ${PASSWORD_MIN} ký tự`)
    .max(PASSWORD_MAX, `Mật khẩu tối đa ${PASSWORD_MAX} ký tự`),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Change password while signed in: verify the current one, then set a new one.
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z
    .string()
    .min(PASSWORD_MIN, `Mật khẩu tối thiểu ${PASSWORD_MIN} ký tự`)
    .max(PASSWORD_MAX, `Mật khẩu tối đa ${PASSWORD_MAX} ký tự`),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
