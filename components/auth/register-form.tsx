"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "./google-button";

type FieldKey = "name" | "email" | "password";
type FieldErrors = Partial<Record<FieldKey, string[]>>;

const initialForm = { name: "", email: "", password: "", confirm: "" };

interface RegisterFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({
  className,
  onSwitchToLogin,
  ...props
}: RegisterFormProps) {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  function update(key: keyof typeof initialForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    if (form.password !== form.confirm) {
      setFieldErrors({ password: ["Mật khẩu nhập lại không khớp"] });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors as FieldErrors);
        setFormError(data.error ?? "Đăng ký thất bại. Vui lòng thử lại.");
        return;
      }

      setCreatedEmail(data.email as string);
      setForm(initialForm);
    } catch {
      setFormError("Không kết nối được máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  if (createdEmail) {
    return (
      <div className="grid gap-4 text-center">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-success-soft text-success">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <p className="text-sm text-muted-foreground">
          Tài khoản{" "}
          <span className="font-medium text-foreground">{createdEmail}</span> đã
          được tạo. Hãy đăng nhập để tiếp tục.
        </p>
        <Button onClick={onSwitchToLogin} className="w-full">
          Tới đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <form
      className={cn("grid gap-4", className)}
      onSubmit={handleSubmit}
      noValidate
      {...props}
    >
      {formError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-[var(--danger-soft)] px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {formError}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="register-name">Họ tên</Label>
        <Input
          id="register-name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={!!fieldErrors.name}
        />
        {fieldErrors.name && (
          <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && (
          <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="register-password">Mật khẩu</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password ? (
          <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Tối thiểu 8 ký tự.</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="register-confirm">Nhập lại mật khẩu</Label>
        <Input
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={(e) => update("confirm", e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Đang tạo tài khoản…" : "Đăng ký"}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        Hoặc
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton label="Đăng ký với Google" />

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToLogin}
          className="h-auto p-0 font-medium"
        >
          Đăng nhập
        </Button>
      </p>
    </form>
  );
}
