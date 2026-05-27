/* Создание / обновление администратора KompasCRM.
   Запуск:  node scripts/create-admin.mjs admin@kompasmigracji.com МойПароль "Александр" */
import bcrypt from "bcryptjs";
import pg from "pg";

const [, , email, password, name] = process.argv;
if (!email || !password) {
  console.error("Использование: node scripts/create-admin.mjs <email> <пароль> [имя]");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("Нет переменной DATABASE_URL");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
});

const hash = await bcrypt.hash(password, 10);
await pool.query(
  `insert into kompas_users (email, password_hash, full_name, role, status)
   values ($1, $2, $3, 'admin', 'active')
   on conflict (email) do update
     set password_hash = excluded.password_hash, role = 'admin', status = 'active'`,
  [email.toLowerCase(), hash, name || "Администратор"]
);
console.log("✓ Администратор создан/обновлён:", email);
await pool.end();
