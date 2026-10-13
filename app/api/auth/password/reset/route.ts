import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/auth/validation";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { RESET_CODE_MAX_ATTEMPTS } from "@/lib/auth/reset-code";

const INVALID = "Mã xác thực không đúng hoặc đã hết hạn.";

// Step 2 of password reset: verify the OTP and set the new password.
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

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Thông tin đặt lại mật khẩu chưa hợp lệ." },
      { status: 400 },
    );
  }

  const { email, code, password } = parsed.data;

  const record = await db.passwordResetCode.findFirst({
    where: { email, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: INVALID }, { status: 400 });
  }

  if (record.attempts >= RESET_CODE_MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Bạn đã nhập sai quá nhiều lần. Hãy yêu cầu mã mới." },
      { status: 429 },
    );
  }

  const codeOk = await verifyPassword(code, record.codeHash);
  if (!codeOk) {
    await db.passwordResetCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return NextResponse.json({ error: INVALID }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  try {
    await db.$transaction([
      db.user.update({ where: { email }, data: { passwordHash } }),
      db.passwordResetCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);
  } catch (error) {
    // P2025 = user no longer exists; treat as an invalid reset attempt.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: INVALID }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Không thể đặt lại mật khẩu. Vui lòng thử lại." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
