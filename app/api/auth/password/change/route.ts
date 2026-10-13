import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { changePasswordSchema } from "@/lib/auth/validation";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

// Change the signed-in user's password. Requires the current password so a
// hijacked session alone can't lock the real owner out.
export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Bạn chưa đăng nhập." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 },
    );
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Thông tin đổi mật khẩu chưa hợp lệ." },
      { status: 400 },
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  const account = await db.user.findUnique({
    where: { id: current.id },
    select: { passwordHash: true },
  });
  if (!account) {
    return NextResponse.json({ error: "Bạn chưa đăng nhập." }, { status: 401 });
  }

  const currentOk = await verifyPassword(currentPassword, account.passwordHash);
  if (!currentOk) {
    return NextResponse.json(
      { error: "Mật khẩu hiện tại không đúng." },
      { status: 400 },
    );
  }

  if (await verifyPassword(newPassword, account.passwordHash)) {
    return NextResponse.json(
      { error: "Mật khẩu mới phải khác mật khẩu hiện tại." },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(newPassword);
  await db.user.update({
    where: { id: current.id },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true });
}
