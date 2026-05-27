/* ВРЕМЕННЫЙ диагностический роут — удалить после отладки!
   GET /api/diag?s=kompas2024 */
export const runtime = "nodejs";
import { NextResponse } from "next/server";

function cc(s) {
  if (!s) return null;
  return { len: s.length, code0: s.charCodeAt(0), first8: s.slice(0, 8) };
}

export async function GET(req) {
  if (new URL(req.url).searchParams.get("s") !== "kompas2024") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const vars = {
    PGHOST:            cc(process.env.PGHOST),
    PGPORT:            process.env.PGPORT || null,
    PGUSER:            cc(process.env.PGUSER),
    PGDATABASE:        process.env.PGDATABASE || null,
    PGSSL:             process.env.PGSSL || null,
    DATABASE_URL:      cc(process.env.DATABASE_URL),
    POSTGRES_URL:      cc(process.env.POSTGRES_URL),
    POSTGRES_HOST:     cc(process.env.POSTGRES_HOST),
    POSTGRES_USER:     cc(process.env.POSTGRES_USER),
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || null,
    JWT_SECRET:        cc(process.env.JWT_SECRET),
    NODE_ENV:          process.env.NODE_ENV,
  };

  // Тест подключения к БД
  let dbResult = "not tested";
  try {
    const { Pool } = await import("pg");

    // Определяем что использует lib/db
    let connConfig = null;
    let which = null;

    const pghost = process.env.PGHOST;
    if (pghost) {
      connConfig = {
        host: pghost,
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE || "postgres",
        ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
      };
      which = "PGHOST";
    } else if (process.env.DATABASE_URL) {
      connConfig = { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } };
      which = "DATABASE_URL";
    } else if (process.env.POSTGRES_URL) {
      connConfig = { connectionString: process.env.POSTGRES_URL, ssl: { rejectUnauthorized: false } };
      which = "POSTGRES_URL";
    } else if (process.env.POSTGRES_HOST) {
      connConfig = {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT) || 5432,
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE || "postgres",
        ssl: { rejectUnauthorized: false },
      };
      which = "POSTGRES_HOST";
    }

    if (connConfig) {
      const pool = new Pool({ ...connConfig, max: 1, connectionTimeoutMillis: 8000 });
      try {
        const r = await pool.query("select current_user, version()");
        dbResult = { ok: true, which, user: r.rows[0].current_user, version: r.rows[0].version.slice(0, 40) };
      } catch (e) {
        dbResult = { ok: false, which, error: e.message };
      } finally {
        await pool.end();
      }
    } else {
      dbResult = { ok: false, which: "none", error: "no db env vars found" };
    }
  } catch (e) {
    dbResult = { ok: false, error: "import failed: " + e.message };
  }

  return NextResponse.json({ vars, dbResult });
}
