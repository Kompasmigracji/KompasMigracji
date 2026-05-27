/* KompasCRM — пул підключень до Postgres.
   Пріоритет змінних:
   1. PGHOST/PGUSER/PGPASSWORD/PGDATABASE   — явні PG* змінні (локальна розробка)
   2. DATABASE_URL                           — власна connection string
   3. POSTGRES_URL                           — Vercel/Supabase integration pooler ✅ доступний з Vercel
   4. POSTGRES_HOST (individual vars)        — прямий хост db.*.supabase.co (заблокований з Vercel без IPv4 add-on)
   5. localhost fallback                     — для локальної розробки без env */
import { Pool } from "pg";

let pool;

/**
 * Очищає рядок: видаляє UTF-8 BOM (U+FEFF, charCode 65279),
 * Windows CR (charCode 13), а потім trim() пробілів.
 * Захищає від артефактів Windows PowerShell pipe.
 */
function clean(s) {
  let r = (s || "");
  // Strip leading BOM characters
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  // Strip all carriage returns
  r = r.split(String.fromCharCode(13)).join("");
  return r.trim();
}

function buildConfig() {
  // Пріоритет 1: явні PGHOST змінні (локальна розробка / кастомні налаштування)
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

  // Пріоритет 2: DATABASE_URL (власна connection string)
  const databaseUrl = clean(process.env.DATABASE_URL);
  if (databaseUrl) {
    console.log("[db] Using DATABASE_URL");
    return {
      connectionString: databaseUrl,
      ssl: clean(process.env.PGSSL) === "false" ? false : { rejectUnauthorized: false },
    };
  }

  // Пріоритет 3: POSTGRES_URL від Vercel/Supabase integration (pooler — доступний з Vercel!)
  // УВАГА: db.*.supabase.co (прямий хост) заблокований з Vercel без Supabase IPv4 add-on.
  // Натомість використовуємо POSTGRES_URL, який вказує на pooler (aws-0-*.pooler.supabase.com).
  // ВАЖЛИВО: Парсимо URL вручну і передаємо окремі параметри, щоб ssl: { rejectUnauthorized: false }
  // точно застосувався — pg v8 + Node 18 ігнорує ssl option коли URL містить sslmode=require.
  const postgresUrl = clean(process.env.POSTGRES_URL);
  if (postgresUrl) {
    console.log("[db] Using POSTGRES_URL (Supabase pooler — parsed)");
    try {
      const u = new URL(postgresUrl);
      return {
        host:     u.hostname,
        port:     parseInt(u.port) || 5432,
        user:     decodeURIComponent(u.username),
        password: decodeURIComponent(u.password),
        database: (u.pathname || "/postgres").replace(/^\//, "") || "postgres",
        ssl: { rejectUnauthorized: false },
      };
    } catch {
      // Fallback: якщо URL не парситься — передаємо connectionString
      console.log("[db] URL parse failed, using connectionString fallback");
      return {
        connectionString: postgresUrl,
        ssl: { rejectUnauthorized: false },
      };
    }
  }

  // Пріоритет 4: POSTGRES_HOST (Supabase integration individual vars)
  // Це прямий хост db.*.supabase.co — може бути заблокований з Vercel.
  // Використовується лише якщо POSTGRES_URL недоступний.
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
