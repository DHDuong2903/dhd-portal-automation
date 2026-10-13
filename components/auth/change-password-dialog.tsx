"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emptyForm = { current: "", next: "", confirm: "" };

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setForm(emptyForm);
    setError(null);
    setDone(false);
    setLoading(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (form.next.length < 8) {
      setError("Mật khẩu mới tối thiểu 8 ký tự.");
      return;
    }
    if (form.next !== form.confirm) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.current,
          newPassword: form.next,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Không đổi được mật khẩu. Vui lòng thử lại.");
        return;
      }
      setDone(true);
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogDescription>Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật.</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="grid gap-4 text-center">
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-success-soft text-success">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <p className="text-sm text-muted-foreground">Mật khẩu của bạn đã được cập nhật.</p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Đóng
            </Button>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="grid gap-2">
              <Label htmlFor="change-current">Mật khẩu hiện tại</Label>
              <Input
                id="change-current"
                type="password"
                autoComplete="current-password"
                value={form.current}
                onChange={(e) => update("current", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="change-next">Mật khẩu mới</Label>
              <Input
                id="change-next"
                type="password"
                autoComplete="new-password"
                value={form.next}
                onChange={(e) => update("next", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Tối thiểu 8 ký tự.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="change-confirm">Nhập lại mật khẩu mới</Label>
              <Input
                id="change-confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Đang cập nhật…" : "Cập nhật mật khẩu"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
