import Link from "next/link";
import {
  ArrowDownToLine,
  Play,
  Users,
  CheckCheck,
  XCircle,
  ArrowRight,
  FileSpreadsheet,
  Clock3,
  Unplug,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Footer } from "@/components/layout/footer";

type StatusTone = "success" | "warning" | "info" | "danger" | "neutral";

const iconWell = "grid place-items-center rounded-lg";

export default function OverviewPage() {
  const statCards = [
    {
      label: "Tổng số lần chạy",
      value: "04",
      note: "Trong không gian thử nghiệm",
      icon: Play,
      iconBg: "bg-info-soft text-info",
    },
    {
      label: "Leads đã xử lý",
      value: "904",
      note: "740 leads được tạo thành công",
      icon: Users,
      iconBg: "bg-success-soft text-success",
    },
    {
      label: "Tỷ lệ thành công",
      value: "81.9%",
      note: "Trên tổng số bản ghi đầu vào",
      icon: CheckCheck,
      iconBg: "bg-success-soft text-success",
    },
    {
      label: "Bản ghi cần kiểm tra",
      value: "156",
      note: "Có lỗi trong quá trình thực thi",
      icon: XCircle,
      iconBg: "bg-warning-soft text-warning",
    },
  ];

  const recentRuns: {
    id: string;
    file: string;
    time: string;
    total: number;
    resultText: React.ReactNode;
    status: string;
    tone: StatusTone;
    iconBg: string;
  }[] = [
    {
      id: "RUN-20261012-004",
      file: "leads_thang10_2026.xlsx",
      time: "12/10/2026 · 09:42",
      total: 248,
      resultText: (
        <>
          <span className="text-success font-medium">242 thành công</span>
          <span className="text-muted-foreground"> · </span>
          <span className="text-destructive font-medium">6 lỗi</span>
        </>
      ),
      status: "Hoàn thành có lỗi",
      tone: "warning",
      iconBg: "bg-success-soft text-success",
    },
    {
      id: "RUN-20261008-003",
      file: "khach_hang_su_kien.csv",
      time: "08/10/2026 · 14:15",
      total: 186,
      resultText: <span className="text-success font-medium">186 thành công</span>,
      status: "Hoàn thành",
      tone: "success",
      iconBg: "bg-info-soft text-info",
    },
    {
      id: "RUN-20261003-002",
      file: "leads_website_t10.xlsx",
      time: "03/10/2026 · 10:30",
      total: 320,
      resultText: (
        <>
          <span className="text-success font-medium">312 thành công</span>
          <span className="text-muted-foreground"> · 8 bỏ qua</span>
        </>
      ),
      status: "Hoàn thành",
      tone: "success",
      iconBg: "bg-success-soft text-success",
    },
    {
      id: "RUN-20260928-001",
      file: "danh_sach_khach_hang.csv",
      time: "28/09/2026 · 16:08",
      total: 150,
      resultText: (
        <>
          <span className="text-muted-foreground">0 thành công</span>
          <span className="text-muted-foreground"> · </span>
          <span className="text-destructive font-medium">150 lỗi</span>
        </>
      ),
      status: "Thất bại",
      tone: "danger",
      iconBg: "bg-info-soft text-info",
    },
  ];

  return (
    <main className="mx-auto max-w-[1440px] px-9 pb-[30px] pt-[34px] max-[768px]:px-4 max-[768px]:py-5">
      {/* Page Heading */}
      <div className="mb-[27px] flex items-center justify-between gap-5">
        <div>
          <h1 className="text-[26px] font-[650] leading-[1.3]">Tổng quan</h1>
          <p className="mt-1 text-[13px] leading-[1.6] text-muted-foreground">
            Mọi workflow và kết quả vận hành, trong một không gian.
          </p>
        </div>
        <Button asChild size="lg" className="h-10 px-4">
          <Link href="/import">
            <ArrowDownToLine className="w-4 h-4 mr-2" />
            Nhập dữ liệu mới
          </Link>
        </Button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-4 gap-[18px] max-[1100px]:gap-3 max-[768px]:grid-cols-2">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                <span className={`${iconWell} h-9 w-9 ${stat.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="text-[30px] font-semibold leading-none tracking-tight mt-4 mb-2.5">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground">{stat.note}</p>
            </Card>
          );
        })}
      </div>

      {/* Section 1: Workflow của bạn */}
      <div className="mb-[17px] mt-[31px] flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">
          Workflow của bạn <span className="text-[11px] text-muted-foreground font-normal ml-1.5">01</span>
        </h2>
        <Button variant="link" size="sm" asChild className="p-0 h-auto font-medium">
          <Link href="/workflows" className="flex items-center gap-1">
            Xem tất cả
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-[1.75fr_1fr] gap-5 max-[1100px]:grid-cols-[1.5fr_1fr] max-[768px]:grid-cols-1">
        {/* Left: Workflow Card */}
        <Card className="overflow-hidden p-0">
          <div className="relative flex h-[152px] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 p-6">
            <span className="absolute left-[18px] top-4 rounded border border-border bg-card px-2.5 py-1 text-[10px] font-semibold tracking-wide text-primary">
              SALES OPERATIONS
            </span>
            <div className="flex w-full items-center justify-center gap-6 opacity-85">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-white/90 p-3 text-xs font-medium text-emerald-800 shadow-sm">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Leads Spreadsheet</span>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600" />
              <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-white/90 p-3 text-xs font-medium text-emerald-800 shadow-sm">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Target CRM</span>
              </div>
            </div>
          </div>

          <CardContent className="p-[22px]">
            <div className="flex justify-between items-center gap-2">
              <h3 className="text-[17px] font-semibold">Import Leads to CRM</h3>
              <StatusBadge tone="success">Sẵn sàng thử nghiệm</StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Nhập danh sách khách hàng từ Excel/CSV vào CRM.
            </p>

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-4">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel / CSV</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground/60" />
              <span>Kiểm tra dữ liệu</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground/60" />
              <span>CRM</span>
            </div>

            <Separator className="mt-5" />
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Clock3 className="w-3 h-3" />
                Chạy gần nhất: hôm nay, 09:42
              </span>
              <Button asChild size="sm" className="h-8 px-3 text-[11px]">
                <Link href="/import">
                  <Play className="w-3 h-3 mr-1.5 fill-current" />
                  Bắt đầu nhập
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Connection Panel */}
        <aside className="flex flex-col justify-center border-border mt-4 md:mt-0 md:border-l md:pl-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-medium text-sm text-foreground">Kết nối & dữ liệu</h3>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground">
              <Link href="/settings" title="Cấu hình kết nối">
                <MoreHorizontal className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="mb-[22px] flex items-center gap-3">
            <span className={`${iconWell} h-11 w-11 bg-info-soft text-info`}>
              <Unplug className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">CRM đích</p>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                <span className="h-[5px] w-[5px] rounded-full bg-warning" />
                Chưa kết nối · Chế độ thử nghiệm
              </span>
            </div>
          </div>

          <div className="mb-[22px] flex items-center gap-3">
            <span className={`${iconWell} h-11 w-11 bg-success-soft text-success`}>
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Kiểm soát trước khi nhập</p>
              <span className="text-[10px] text-muted-foreground">Kiểm tra định dạng & cảnh báo trùng</span>
            </div>
          </div>

          <div className="mb-[22px] flex items-center gap-3">
            <span className={`${iconWell} h-11 w-11 bg-warning-soft text-warning`}>
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Xác nhận từng bản ghi</p>
              <span className="text-[10px] text-muted-foreground">Theo dõi kết quả, chạy lại có kiểm soát</span>
            </div>
          </div>

          <Button variant="outline" size="sm" asChild className="w-full mt-2 text-xs font-medium">
            <Link href="/settings" className="flex items-center justify-center gap-1.5">
              Quản lý cấu hình
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </aside>
      </div>

      {/* Section 2: Các lần chạy gần đây */}
      <div className="mb-[17px] mt-[31px] flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Các lần chạy gần đây</h2>
        <Button variant="link" size="sm" asChild className="p-0 h-auto font-medium">
          <Link href="/history" className="flex items-center gap-1">
            Xem lịch sử
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>File nguồn / Mã lần chạy</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Bản ghi</TableHead>
              <TableHead>Kết quả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRuns.map((run) => (
              <TableRow key={run.id}>
                <TableCell>
                  <Link href={`/runs/${run.id}`} className="flex items-center gap-3 group">
                    <span className={`${iconWell} h-9 w-9 ${run.iconBg}`}>
                      <FileSpreadsheet className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="font-medium text-foreground block group-hover:text-primary transition-colors">
                        {run.file}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">{run.id}</span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{run.time}</TableCell>
                <TableCell className="font-medium">{run.total}</TableCell>
                <TableCell>{run.resultText}</TableCell>
                <TableCell>
                  <StatusBadge tone={run.tone}>{run.status}</StatusBadge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Link href={`/runs/${run.id}`} title="Xem chi tiết lần chạy">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-border px-[18px] py-3 text-[11px] text-muted-foreground">
          <span>Hiển thị 4 lần chạy</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled className="h-6 w-6" aria-label="Trang trước">
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="text-primary font-semibold px-1 text-xs">1</span>
            <Button variant="outline" size="icon" disabled className="h-6 w-6" aria-label="Trang sau">
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <Footer />
    </main>
  );
}
