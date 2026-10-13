"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ForgotPasswordForm } from "./forgot-password-form";

type AuthMode = "login" | "register" | "forgot";

const COPY: Record<AuthMode, { title: string; description: string }> = {
  login: {
    title: "Đăng nhập tài khoản",
    description: "Nhập email để truy cập không gian làm việc Portalflow.",
  },
  register: {
    title: "Đăng ký tài khoản",
    description: "Tạo tài khoản để truy cập không gian làm việc Portalflow.",
  },
  forgot: {
    title: "Quên mật khẩu",
    description: "Đặt lại mật khẩu bằng mã xác thực gửi qua email.",
  },
};

interface AuthDialogProps {
  children: React.ReactNode;
  defaultMode?: AuthMode;
}

export function AuthDialog({ children, defaultMode = "login" }: AuthDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  function handleLoggedIn() {
    setOpen(false);
    // Re-render server components (the sidebar) so the signed-in user shows.
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setMode(defaultMode);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{COPY[mode].title}</DialogTitle>
          <DialogDescription>{COPY[mode].description}</DialogDescription>
        </DialogHeader>

        {mode === "login" && (
          <LoginForm
            onSwitchToRegister={() => setMode("register")}
            onForgotPassword={() => setMode("forgot")}
            onSuccess={handleLoggedIn}
          />
        )}
        {mode === "register" && (
          <RegisterForm onSwitchToLogin={() => setMode("login")} />
        )}
        {mode === "forgot" && (
          <ForgotPasswordForm onBackToLogin={() => setMode("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}
