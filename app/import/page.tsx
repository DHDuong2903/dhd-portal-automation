"use client";

import { useState } from "react";

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
        setError(data.error ?? "Upload failed.");
      } else {
        setPreview(data as Preview);
      }
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Import Leads
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Upload a CSV or Excel file to preview its columns and rows.
      </p>

      <div className="mt-6 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
        <input
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setPreview(null);
            setError(null);
          }}
          className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700 dark:text-zinc-300 dark:file:bg-zinc-100 dark:file:text-zinc-900"
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? "Reading…" : "Preview file"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {preview && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {preview.filename}
              </span>{" "}
              ({(preview.sizeBytes / 1024).toFixed(1)} KB)
            </span>
            <span>{preview.rowCount} data rows</span>
            <span>{preview.headers.length} columns</span>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  {preview.headers.map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.sampleRows.map((row, i) => (
                  <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
                    {preview.headers.map((h) => (
                      <td
                        key={h}
                        className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-300"
                      >
                        {row[h] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Showing up to {preview.sampleRows.length} sample rows.
          </p>
        </div>
      )}
    </div>
  );
}
