export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  // RLS for file downloads: only logged-in administrators, lawyers, or salespeople
  const auth = await requireAuth(["admin", "moderator", "manager", "sales", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const f = await one("SELECT * FROM kompas_files WHERE id = $1", [params.id]);
    if (!f) {
      return NextResponse.json({ error: "Файл не знайдено" }, { status: 404 });
    }

    const absolutePath = path.join(process.cwd(), f.storage_path);
    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json({ error: "Файл відсутній на диску" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(absolutePath);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": f.mime_type || "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.original_name)}`,
      },
    });
  } catch (err) {
    console.error("GET File Download error:", err);
    return NextResponse.json({ error: "Помилка при скачуванні файлу" }, { status: 500 });
  }
}
