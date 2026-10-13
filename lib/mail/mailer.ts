import nodemailer, { type Transporter } from "nodemailer";
import { env } from "@/lib/env";

let cachedTransporter: Transporter | null = null;

export function isMailConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

function getTransporter(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      // 465 = implicit TLS; other ports (587) use STARTTLS.
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return cachedTransporter;
}

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail(message: MailMessage): Promise<void> {
  const transporter = getTransporter();

  // Dev fallback: without SMTP creds, print the message so flows stay testable
  // (the user opted into this for the MVP until a real mailbox is wired up).
  if (!transporter) {
    console.warn(
      [
        "[mail] SMTP chưa cấu hình — email KHÔNG được gửi thật.",
        `  To:      ${message.to}`,
        `  Subject: ${message.subject}`,
        `  Body:    ${message.text}`,
      ].join("\n"),
    );
    return;
  }

  await transporter.sendMail({
    from: env.MAIL_FROM || env.SMTP_USER,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}
