import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requestResetSchema } from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";
import { generateResetCode, RESET_CODE_TTL_MS } from "@/lib/auth/reset-code";
import { sendPasswordResetCode } from "@/lib/mail/password-reset";

// Step 1 of password reset: issue a one-time code by email. Responds the same
// whether or not the email exists, so this endpoint can't be used to probe
// which emails are registered.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 },
    );
  }

  const parsed = requestResetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 });
  }

  const { email } = parsed.data;
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (user) {
    const code = generateResetCode();
    const codeHash = await hashPassword(code);
    // Replace any prior outstanding codes for this email.
    await db.passwordResetCode.deleteMany({ where: { email } });
    await db.passwordResetCode.create({
      data: {
        email,
        codeHash,
        expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS),
      },
    });

    try {
      await sendPasswordResetCode(email, code);
    } catch {
      return NextResponse.json(
        { error: "Không gửi được email. Vui lòng thử lại sau." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
