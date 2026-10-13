"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "./google-button";

interface LoginFormProps
  extends Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit"> {
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
  onSuccess?: () => void;
}

export function LoginForm({
  className,
  onSwitchToRegister,
  onForgotPassword,
  onSuccess,
  ...props
}: LoginFormProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Đăng nhập thất bại. Vui lòng thử lại.");
        return;
      }
      onSuccess?.();
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={cn("grid gap-4", className)} onSubmit={handleSubmit} {...props}>
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-[var(--danger-soft)] px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="ban@congty.com"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="login-password">Mật khẩu</Label>
          <Button
            type="button"
            variant="link"
            onClick={onForgotPassword}
            className="ml-auto h-auto p-0 text-xs text-muted-foreground"
          >
            Quên mật khẩu?
          </Button>
        </div>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Đang đăng nhập…" : "Đăng nhập"}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        Hoặc
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToRegister}
          className="h-auto p-0 font-medium"
        >
          Đăng ký
        </Button>
      </p>
    </form>
  );
}
