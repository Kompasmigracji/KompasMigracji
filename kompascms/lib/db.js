/* KompasCMS — пул подключений к Postgres.
   Если в проекте уже есть db-слой — можно заменить экспорт q() на свой. */
import { Pool } from "pg";

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
      max: 8,
    });
  }
  return pool;
}

/** Выполнить запрос, вернуть массив строк. */
export async function q(text, params = []) {
  const res = await getPool().query(text, params);
  return res.rows;
}

/** Выполнить запрос, вернуть первую строку или null. */
export async function one(text, params = []) {
  const rows = await q(text, params);
  return rows[0] || null;
}
