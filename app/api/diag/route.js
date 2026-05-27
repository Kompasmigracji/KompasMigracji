/* Тимчасовий діагностичний endpoint — ВИДАЛИТИ після налагодження */
export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("s") !== "kompas2024") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Показуємо наявні env vars (не значення!)
  const envKeys = [
    "PGHOST","PGPORT","PGUSER","PGDATABASE","PGSSL",
    "POSTGRES_HOST","POSTGRES_PORT","POSTGRES_USER","POSTGRES_DATABASE",
    "POSTGRES_URL","POSTGRES_URL_NON_POOLING","DATABASE_URL",
    "JWT_SECRET","NODE_ENV",
  ];
  const envPresence = {};
  for (const k of envKeys) {
    const v = process.env[k];
    if (v) {
      // Show first 8 chars + length, never full value
      envPresence[k] = `"${v.slice(0,8)}..." (len=${v.length}, code0=${v.charCodeAt(0)})`;
    } else {
      envPresence[k] = null;
    }
  }

  // Спробуємо підключитись до БД
  let dbResult;
  try {
    const { Pool } = await import("pg");
    let config;
    const pghost = (process.env.PGHOST || "").trim();
    const postgresHost = (process.env.POSTGRES_HOST || "").trim();
    const connStr = (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim();
    const nonPoolingStr = (process.env.POSTGRES_URL_NON_POOLING || "").trim();

    if (pghost) {
      config = { host: pghost, port: Number(process.env.PGPORT)||5432, user: process.env.PGUSER||"postgres", password: process.env.PGPASSWORD, database: process.env.PGDATABASE||"postgres", ssl:{rejectUnauthorized:false} };
      dbResult = { using: "PGHOST", host: pghost };
    } else if (postgresHost) {
      config = { host: postgresHost, port: Number(process.env.POSTGRES_PORT)||5432, user: process.env.POSTGRES_USER||"postgres", password: process.env.POSTGRES_PASSWORD, database: process.env.POSTGRES_DATABASE||"postgres", ssl:{rejectUnauthorized:false} };
      dbResult = { using: "POSTGRES_HOST", host: postgresHost };
    } else if (nonPoolingStr) {
      config = { connectionString: nonPoolingStr, ssl:{rejectUnauthorized:false} };
      dbResult = { using: "POSTGRES_URL_NON_POOLING" };
    } else if (connStr) {
      config = { connectionString: connStr, ssl:{rejectUnauthorized:false} };
      dbResult = { using: "POSTGRES_URL/DATABASE_URL" };
    } else {
      dbResult = { using: "NONE — localhost fallback" };
      config = { host:"localhost", port:5432, user:"postgres", password:"", database:"postgres", ssl:false };
    }

    const pool = new Pool({ ...config, max:1, connectionTimeoutMillis:8000 });
    const r = await pool.query("SELECT current_database() as db, (SELECT count(*) FROM kompas_users) as users");
    dbResult.ok = true;
    dbResult.db = r.rows[0].db;
    dbResult.userCount = r.rows[0].users;
    await pool.end();
  } catch (err) {
    dbResult = { ...dbResult, ok: false, error: err.message, code: err.code };
  }

  return NextResponse.json({ env: envPresence, db: dbResult });
}
