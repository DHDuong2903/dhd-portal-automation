"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Step = "email" | "code" | "done";

const CODE_LENGTH = 6;

interface ForgotPasswordFormProps {
  className?: string;
  onBackToLogin?: () => void;
}

export function ForgotPasswordForm({
  className,
  onBackToLogin,
}: ForgotPasswordFormProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestCode(): Promise<boolean> {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Không gửi được mã. Vui lòng thử lại.");
        return false;
      }
      return true;
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleSendCode(event: React.FormEvent) {
    event.preventDefault();
    if (await requestCode()) setStep("code");
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (code.length < CODE_LENGTH) {
      setError("Vui lòng nhập đủ mã xác thực.");
      return;
    }
    if (password.length < 8) {
      setError("Mật khẩu mới tối thiểu 8 ký tự.");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Không đặt lại được mật khẩu. Vui lòng thử lại.");
        return;
      }
      setStep("done");
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "done") {
    return (
      <div className={cn("grid gap-4 text-center", className)}>
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-success-soft text-success">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <p className="text-sm text-muted-foreground">
          Mật khẩu đã được đặt lại. Hãy đăng nhập bằng mật khẩu mới.
        </p>
        <Button onClick={onBackToLogin} className="w-full">
          Tới đăng nhập
        </Button>
      </div>
    );
  }

  if (step === "code") {
    return (
      <form
        className={cn("grid gap-4", className)}
        onSubmit={handleResetPassword}
      >
        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Mã xác thực đã gửi tới{" "}
            <span className="font-medium text-foreground">
              {email || "email của bạn"}
            </span>
            .
          </span>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="grid gap-2">
          <Label htmlFor="reset-code">Mã xác thực</Label>
          <InputOTP
            id="reset-code"
            maxLength={CODE_LENGTH}
            value={code}
            onChange={setCode}
          >
            <InputOTPGroup>
              {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reset-password">Mật khẩu mới</Label>
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Tối thiểu 8 ký tự.</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reset-confirm">Nhập lại mật khẩu mới</Label>
          <Input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Đang xử lý…" : "Đổi mật khẩu"}
        </Button>

        <Button
          type="button"
          variant="link"
          onClick={() => requestCode()}
          disabled={loading}
          className="mx-auto h-auto p-0 text-sm text-muted-foreground"
        >
          Chưa nhận được mã? Gửi lại
        </Button>
      </form>
    );
  }

  return (
    <form
      className={cn("grid gap-4", className)}
      onSubmit={handleSendCode}
    >
      <p className="text-sm text-muted-foreground">
        Nhập email tài khoản, chúng tôi sẽ gửi mã xác thực để bạn đặt lại mật
        khẩu.
      </p>

      <div className="grid gap-2">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="ban@congty.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Đang gửi…" : "Gửi mã xác thực"}
      </Button>

      <Button
        type="button"
        variant="link"
        onClick={onBackToLogin}
        className="mx-auto h-auto gap-1 p-0 text-sm text-muted-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Quay lại đăng nhập
      </Button>
    </form>
  );
}
