// src/app/api/upload/route.js
import { NextResponse } from "next/server";
import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";

/* helper: buffer form-data file */
async function fileFromRequest(request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!file) throw new Error("No file");
  const arrayBuffer = await file.arrayBuffer();
  return { file, buffer: Buffer.from(arrayBuffer) };
}

export async function POST(request) {
  try {
    const { file, buffer } = await fileFromRequest(request);

    // Save to /uploads (outside /public)
    const dir = join(process.cwd(), "uploads");
    mkdirSync(dir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filepath = join(dir, filename);
    writeFileSync(filepath, buffer);

    // Return API route URL for serving the image
    return NextResponse.json({ path: `/api/uploads/${filename}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}
