import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";

// Creates a new user account. Input stage only — no session is established
// here; sign-in is a separate slice.
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

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Thông tin đăng ký chưa hợp lệ.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;
  const passwordHash = await hashPassword(password);

  try {
    const user = await db.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    // P2002 = unique constraint violation on email. Checked via the DB rather
    // than a pre-read so concurrent sign-ups can't both slip through.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email này đã được đăng ký." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Không thể tạo tài khoản. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
