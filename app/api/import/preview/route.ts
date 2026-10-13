import { NextResponse } from "next/server";
import { parseTable } from "@/lib/file-processing/parse";
import {
  ALLOWED_EXTENSIONS,
  MAX_FILE_BYTES,
  hasAllowedExtension,
} from "@/lib/file-processing/limits";

// Accepts a multipart upload, validates it and returns a parse preview.
// No run is created here — this is the input stage only (MVP §5 step 1-2).
export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }

  if (!hasAllowedExtension(file.name)) {
    return NextResponse.json(
      { error: `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}` },
      { status: 415 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: `File is larger than ${MAX_FILE_BYTES / (1024 * 1024)}MB.` },
      { status: 413 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const result = parseTable(bytes);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({
    filename: file.name,
    sizeBytes: file.size,
    headers: result.headers,
    rowCount: result.rowCount,
    sampleRows: result.sampleRows,
  });
}
