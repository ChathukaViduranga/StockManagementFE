import { NextResponse } from "next/server";
import { join } from "path";
import { readFileSync, existsSync } from "fs";

export async function GET(request, { params }) {
  const { filename } = params;
  const filePath = join(process.cwd(), "uploads", filename);

  if (!existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Infer content type from extension (basic)
  const ext = filename.split(".").pop().toLowerCase();
  const mime =
    ext === "png"
      ? "image/png"
      : ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : "application/octet-stream";

  const fileBuffer = readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: { "Content-Type": mime },
  });
}
