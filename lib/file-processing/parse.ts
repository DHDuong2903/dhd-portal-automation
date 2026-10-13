import * as XLSX from "xlsx";

export type ParsePreview = {
  headers: string[];
  rowCount: number;
  sampleRows: Record<string, string>[];
};

export type ParseResult =
  | ({ ok: true } & ParsePreview)
  | { ok: false; error: string };

const SAMPLE_LIMIT = 10;

function isEmptyRow(row: string[]): boolean {
  return row.every((cell) => cell === undefined || `${cell}`.trim() === "");
}

// Parses the first sheet of a CSV/Excel file into headers + sample rows.
// Errors are returned as values so callers can surface them without try/catch.
export function parseTable(data: Uint8Array): ParseResult {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(data, { type: "array" });
  } catch {
    return { ok: false, error: "Could not read the file. Is it a valid CSV or Excel file?" };
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { ok: false, error: "The file has no sheets." };
  }

  const rows = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets[sheetName], {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });

  const nonEmpty = rows.filter((row) => !isEmptyRow(row));
  if (nonEmpty.length === 0) {
    return { ok: false, error: "The file is empty." };
  }

  const headers = nonEmpty[0].map((h) => `${h}`.trim());
  if (headers.every((h) => h === "")) {
    return { ok: false, error: "The first row must contain column headers." };
  }

  const dataRows = nonEmpty.slice(1);
  const sampleRows = dataRows.slice(0, SAMPLE_LIMIT).map((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      if (header !== "") record[header] = `${row[i] ?? ""}`.trim();
    });
    return record;
  });

  return {
    ok: true,
    headers: headers.filter((h) => h !== ""),
    rowCount: dataRows.length,
    sampleRows,
  };
}
