export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get("entity_type") || "";
  const entityId = searchParams.get("entity_id") || "";

  if (!entityType || !entityId) {
    return NextResponse.json({ error: "entity_type та entity_id обов'язкові" }, { status: 400 });
  }

  try {
    const rows = await q(
      `SELECT f.*, u.full_name AS uploader_name
       FROM kompas_files f
       LEFT JOIN kompas_users u ON u.id = f.uploaded_by
       WHERE f.entity_type = $1 AND f.entity_id = $2
       ORDER BY f.created_at DESC`,
      [entityType, entityId]
    );

    return NextResponse.json({ files: rows });
  } catch (err) {
    console.error("GET Files error:", err);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const entityType = formData.get("entity_type");
    const entityId = formData.get("entity_id");

    if (!file || !entityType || !entityId) {
      return NextResponse.json({ error: "Потрібно завантажити файл та вказати entity_type, entity_id" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    const mimeType = file.type;
    const sizeBytes = file.size;

    const fileId = crypto.randomUUID();
    const ext = path.extname(originalName);
    const filename = `${fileId}${ext}`;

    // Target upload path
    const uploadDir = path.join(process.cwd(), "public", "uploads", entityType);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storagePath = path.join("public", "uploads", entityType, filename);
    const absolutePath = path.join(process.cwd(), storagePath);

    fs.writeFileSync(absolutePath, buffer);

    const row = await one(
      `INSERT INTO kompas_files (
        id, entity_type, entity_id, filename, original_name, mime_type, size_bytes, storage_path, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        fileId,
        entityType,
        String(entityId),
        filename,
        originalName,
        mimeType,
        sizeBytes,
        storagePath,
        auth.user.id
      ]
    );

    // Auto-create an activity timeline entry for this upload
    await q(
      `INSERT INTO kompas_activities (
        entity_type, entity_id, actor_id, type, title, body, metadata
      ) VALUES ($1, $2, $3, 'file', $4, $5, $6)`,
      [
        entityType,
        String(entityId),
        auth.user.id,
        "Додано документ",
        `Завантажено файл: ${originalName} (${(sizeBytes / 1024).toFixed(1)} KB)`,
        JSON.stringify({ file_id: row.id, mime: mimeType })
      ]
    );

    return NextResponse.json({ file: row }, { status: 201 });
  } catch (err) {
    console.error("POST File Upload error:", err);
    return NextResponse.json({ error: "Помилка при завантаженні файлу" }, { status: 500 });
  }
}
