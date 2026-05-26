/* KompasCMS — пул підключень до Postgres.
   Підтримує DATABASE_URL або окремі змінні PGHOST/PGUSER/PGPASSWORD/PGDATABASE.
   Окремі змінні рекомендовані: уникають проблем з URL-кодуванням спецсимволів (@, !) у паролі. */
import { Pool } from "pg";

let pool;

function buildConfig() {
  // Пріоритет 1: окремі PG-змінні (рекомендовано для Vercel)
  if (process.env.PGHOST) {
    return {
      host:     process.env.PGHOST,
      port:     Number(process.env.PGPORT) || 5432,
      user:     process.env.PGUSER     || "postgres",
      password: process.env.PGPASSWORD || "",
      database: process.env.PGDATABASE || "postgres",
      ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
    };
  }

  // Пріоритет 2: DATABASE_URL (символи @/! у паролі потрібно кодувати як %40/%21)
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
    };
  }

  // Fallback для локальної розробки
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
