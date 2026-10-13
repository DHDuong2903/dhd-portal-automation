"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, ChevronDown, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { ChangePasswordDialog } from "@/components/auth/change-password-dialog";
import type { SessionUser } from "@/lib/auth/current-user";

function getInitials(source: string): string {
  const parts = source.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function Topbar({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [changePwOpen, setChangePwOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/") return "Tổng quan";
    if (pathname.startsWith("/import")) return "Nhập dữ liệu";
    if (pathname.startsWith("/workflows")) return "Workflows";
    if (pathname.startsWith("/history")) return "Lịch sử chạy";
    if (pathname.startsWith("/settings")) return "Cấu hình";
    if (pathname.startsWith("/runs")) return "Chi tiết lần chạy";
    return "Tổng quan";
  };

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border bg-card px-6 max-[768px]:px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground" />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Không gian làm việc
        </span>
        <span className="hidden text-border sm:inline">/</span>
        <span className="text-xs font-medium text-foreground">
          {getPageTitle()}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant="neutral"
          className="hidden rounded-md px-2 py-1 text-[10px] font-medium sm:inline-flex"
        >
          MVP <span className="text-muted-foreground">v1.0</span>
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Thông báo"
        >
          <Bell className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-5" />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="group flex h-auto items-center gap-2 px-1.5 py-1">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {getInitials(user.name ?? user.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-xs font-medium text-foreground sm:inline">
                  {user.name ?? user.email}
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 sm:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {user.name ?? "Người dùng"}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setChangePwOpen(true)}>
                <KeyRound className="h-4 w-4" />
                Đặt lại mật khẩu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} disabled={loggingOut}>
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Đang đăng xuất…" : "Đăng xuất"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <AuthDialog>
            <Button size="sm">Đăng nhập</Button>
          </AuthDialog>
        )}
      </div>

      {user && (
        <ChangePasswordDialog
          open={changePwOpen}
          onOpenChange={setChangePwOpen}
        />
      )}
    </header>
  );
}
