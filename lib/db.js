/* KompasCMS — пул підключень до Postgres.
   Пріоритет змінних:
   1. PGHOST/PGUSER/PGPASSWORD/PGDATABASE  (наші PG* змінні)
   2. POSTGRES_HOST/POSTGRES_USER тощо    (Vercel/Supabase integration vars)
   3. DATABASE_URL або POSTGRES_URL        (connection string)
   4. localhost fallback для локальної розробки */
import { Pool } from "pg";

let pool;

function buildConfig() {
  // .trim() захищає від зайвих \r\n що можуть потрапити через CLI на Windows
  const pghost = (process.env.PGHOST || "").trim();
  if (pghost) {
    console.log("[db] Using PGHOST:", pghost);
    return {
      host:     pghost,
      port:     Number((process.env.PGPORT || "").trim()) || 5432,
      user:     (process.env.PGUSER     || "").trim() || "postgres",
      password: (process.env.PGPASSWORD || "").trim(),
      database: (process.env.PGDATABASE || "").trim() || "postgres",
      ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
    };
  }

  // Пріоритет 2: POSTGRES_* змінні від Vercel/Supabase integration
  const postgresHost = (process.env.POSTGRES_HOST || "").trim();
  if (postgresHost) {
    console.log("[db] Using POSTGRES_HOST:", postgresHost);
    return {
      host:     postgresHost,
      port:     Number((process.env.POSTGRES_PORT || "").trim()) || 5432,
      user:     (process.env.POSTGRES_USER     || "").trim() || "postgres",
      password: (process.env.POSTGRES_PASSWORD || "").trim(),
      database: (process.env.POSTGRES_DATABASE || "").trim() || "postgres",
      ssl: { rejectUnauthorized: false },
    };
  }

  // Пріоритет 3: DATABASE_URL або POSTGRES_URL (connection string)
  const connStr = (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim();
  if (connStr) {
    console.log("[db] Using connection string (DATABASE_URL/POSTGRES_URL)");
    return {
      connectionString: connStr,
      ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
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
    console.error("[db] Query error:", err.message, "| sql:", text.slice(0, 80));
    throw err;
  }
}

/** Виконати запит, повернути перший рядок або null. */
export async function one(text, params = []) {
  const rows = await q(text, params);
  return rows[0] || null;
}
