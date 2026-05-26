/* KompasCMS — пул підключень до Postgres.
   Пріоритет змінних:
   1. PGHOST/PGUSER/PGPASSWORD/PGDATABASE  (наші PG* змінні)
   2. POSTGRES_HOST/POSTGRES_USER тощо    (Vercel/Supabase integration vars)
   3. DATABASE_URL або POSTGRES_URL        (connection string)
   4. localhost fallback для локальної розробки */
import { Pool } from "pg";

let pool;

/**
 * Очищає рядок: видаляє UTF-8 BOM (U+FEFF), Windows CR (\r),
 * а потім trim() пробілів. Захищає від артефактів Windows PowerShell pipe.
 */
function clean(s) {
  // eslint-disable-next-line no-control-regex
  return (s || "").replace(/﻿/g, "").replace(/\r/g, "").trim();
}

function buildConfig() {
  const pghost = clean(process.env.PGHOST);
  if (pghost) {
    console.log("[db] Using PGHOST:", JSON.stringify(pghost));
    return {
      host:     pghost,
      port:     Number(clean(process.env.PGPORT)) || 5432,
      user:     clean(process.env.PGUSER) || "postgres",
      password: clean(process.env.PGPASSWORD),
      database: clean(process.env.PGDATABASE) || "postgres",
      ssl: clean(process.env.PGSSL) === "false" ? false : { rejectUnauthorized: false },
    };
  }

  // Пріоритет 2: POSTGRES_* змінні від Vercel/Supabase integration
  const postgresHost = clean(process.env.POSTGRES_HOST);
  if (postgresHost) {
    console.log("[db] Using POSTGRES_HOST:", JSON.stringify(postgresHost));
    return {
      host:     postgresHost,
      port:     Number(clean(process.env.POSTGRES_PORT)) || 5432,
      user:     clean(process.env.POSTGRES_USER) || "postgres",
      password: clean(process.env.POSTGRES_PASSWORD),
      database: clean(process.env.POSTGRES_DATABASE) || "postgres",
      ssl: { rejectUnauthorized: false },
    };
  }

  // Пріоритет 3: DATABASE_URL або POSTGRES_URL (connection string)
  const connStr = clean(process.env.DATABASE_URL) || clean(process.env.POSTGRES_URL);
  if (connStr) {
    console.log("[db] Using connection string (DATABASE_URL/POSTGRES_URL)");
    return {
      connectionString: connStr,
      ssl: clean(process.env.PGSSL) === "false" ? false : { rejectUnauthorized: false },
    };
  }

  // Fallback для локальної розробки
  console.log("[db] Using localhost fallback");
  return {
    host:     "localhost",
    port:     5432,
    user:     "postgres",
    password: "",
    database: "postgres",
    ssl:      false,
  };
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      ...buildConfig(),
      max: 8,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis:       30_000,
    });

    pool.on("error", (err) => {
      console.error("[db] Unexpected pool error:", err.message);
    });
  }
  return pool;
}

/** Виконати запит, повернути масив рядків. */
export async function q(text, params = []) {
  try {
    const res = await getPool().query(text, params);
    return res.rows;
  } catch (err) {
    console.error("[db] Query error:", err.message, "| sql:", text.slice(0, 120));
    throw err;
  }
}

/** Виконати запит, повернути перший рядок або null. */
export async function one(text, params = []) {
  const rows = await q(text, params);
  return rows[0] || null;
}
