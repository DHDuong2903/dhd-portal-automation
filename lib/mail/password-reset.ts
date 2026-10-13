import { sendMail } from "./mailer";

export const RESET_CODE_TTL_MINUTES = 10;

export async function sendPasswordResetCode(
  email: string,
  code: string,
): Promise<void> {
  const subject = "Mã đặt lại mật khẩu Portalflow";
  const text = [
    "Mã xác thực để đặt lại mật khẩu của bạn là:",
    "",
    `    ${code}`,
    "",
    `Mã có hiệu lực trong ${RESET_CODE_TTL_MINUTES} phút.`,
    "Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.",
  ].join("\n");

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:440px;margin:0 auto;color:#1a2b22">
    <h2 style="font-size:18px;margin:0 0 12px">Đặt lại mật khẩu Portalflow</h2>
    <p style="margin:0 0 16px;color:#5b6b63">Dùng mã xác thực bên dưới để đặt lại mật khẩu của bạn:</p>
    <div style="font-size:30px;font-weight:700;letter-spacing:8px;background:#f1f6f3;border:1px solid #dbe7e1;border-radius:10px;padding:16px;text-align:center;color:#13231c">${code}</div>
    <p style="margin:16px 0 0;color:#5b6b63;font-size:13px">Mã có hiệu lực trong ${RESET_CODE_TTL_MINUTES} phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
  </div>`;

  await sendMail({ to: email, subject, text, html });
}
