"use client";

import { useState } from "react";
import { FileSpreadsheet, UploadCloud, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Preview = {
  filename: string;
  sizeBytes: number;
  headers: string[];
  rowCount: number;
  sampleRows: Record<string, string>[];
};

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setPreview(null);

    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/import/preview", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Không đọc được tệp. Vui lòng thử lại.");
      } else {
        setPreview(data as Preview);
      }
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-9 pb-[30px] pt-[34px] max-[768px]:px-4 max-[768px]:py-5">
      <div className="mb-[27px] flex items-center justify-between gap-5">
        <div>
          <h1 className="text-[26px] font-[650] leading-[1.3]">
            Nhập dữ liệu leads
          </h1>
          <p className="mt-1 text-[13px] leading-[1.6] text-muted-foreground">
            Tải lên tệp CSV hoặc Excel để xem trước cột và dòng dữ liệu.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <UploadCloud className="w-4 h-4 text-primary" />
            Chọn tệp nguồn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setPreview(null);
              setError(null);
            }}
            className="h-auto cursor-pointer py-2 file:mr-4 file:cursor-pointer file:rounded-md file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
          />
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? "Đang đọc…" : "Xem trước tệp"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mt-6 border-destructive/30 bg-[var(--danger-soft)]">
          <CardContent className="flex items-center gap-2 py-4 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </CardContent>
        </Card>
      )}

      {preview && (
        <Card className="mt-6 overflow-hidden p-0">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-success-soft text-success">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-foreground">{preview.filename}</span>
                <span className="block text-[10px] font-normal text-muted-foreground">
                  {(preview.sizeBytes / 1024).toFixed(1)} KB
                </span>
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <StatusBadge tone="info">{preview.rowCount} dòng dữ liệu</StatusBadge>
              <StatusBadge tone="neutral">
                {preview.headers.length} cột
              </StatusBadge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {preview.headers.map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.sampleRows.map((row, i) => (
                  <TableRow key={i}>
                    {preview.headers.map((h) => (
                      <TableCell key={h} className="text-foreground">
                        {row[h] ?? ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="border-t border-border px-[18px] py-3 text-[11px] text-muted-foreground">
            Hiển thị tối đa {preview.sampleRows.length} dòng mẫu.
          </div>
        </Card>
      )}
    </main>
  );
}
