import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log("Connected to database. Setting up full CRM schema...");

  // 1. Create tables
  await client.query(`
    -- Enable UUID extension if not already enabled
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Sources
    CREATE TABLE IF NOT EXISTS sources (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) DEFAULT 'other',
      status BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Buyers (Покупці)
    CREATE TABLE IF NOT EXISTS buyers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      full_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      email VARCHAR(255),
      source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Leads (Ліди / Воронка)
    CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'Новий',
      price NUMERIC(10, 2) DEFAULT 0,
      manager_id UUID, -- For now, just UUID without FK to users
      source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Orders (Замовлення)
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_number VARCHAR(50) UNIQUE NOT NULL,
      buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'Новий',
      payment_status VARCHAR(50) DEFAULT 'Неоплачено',
      total_price NUMERIC(10, 2) DEFAULT 0,
      manager_id UUID,
      source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Products (Товари)
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      price NUMERIC(10, 2) DEFAULT 0,
      qty_in_stock INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Order Items (Склад замовлення)
    CREATE TABLE IF NOT EXISTS order_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
      quantity INTEGER DEFAULT 1,
      price NUMERIC(10, 2) DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Tables created successfully.");

  // 2. Enable Realtime for all tables
  const tables = ['sources', 'buyers', 'leads', 'orders', 'products', 'order_items'];
  for (const table of tables) {
    try {
      await client.query(`ALTER PUBLICATION supabase_realtime ADD TABLE ${table};`);
      console.log(`✅ Realtime enabled for ${table}`);
    } catch (err) {
      if (err.message.includes("already in publication")) {
        console.log(`ℹ️ Realtime already enabled for ${table}`);
      } else {
        console.error(`❌ Error enabling realtime for ${table}:`, err.message);
      }
    }
  }

  // 3. Seed Mock Data (Optional)
  try {
    const res = await client.query("SELECT COUNT(*) FROM sources;");
    if (parseInt(res.rows[0].count) === 0) {
      console.log("Seeding initial mock data...");
      
      const sourceRes = await client.query(`
        INSERT INTO sources (name, type) VALUES ('Telegram', 'telegram') RETURNING id;
      `);
      const sourceId = sourceRes.rows[0].id;

      const productRes = await client.query(`
        INSERT INTO products (name, category, price) VALUES 
        ('Довідка про несудимість', 'Довідки', 450.00),
        ('Карта побиту', 'Легалізація', 2500.00)
        RETURNING id;
      `);
      const product1Id = productRes.rows[0].id;

      const buyerRes = await client.query(`
        INSERT INTO buyers (full_name, phone, source_id) VALUES 
        ('Іван Петренко', '+380501234567', $1),
        ('Олена Коваленко', '+48729417050', $1)
        RETURNING id;
      `, [sourceId]);
      const buyer1Id = buyerRes.rows[0].id;

      await client.query(`
        INSERT INTO leads (title, buyer_id, status, price, source_id) VALUES 
        ('Заявка на карту побиту', $1, 'Новий', 2500.00, $2);
      `, [buyer1Id, sourceId]);

      const orderRes = await client.query(`
        INSERT INTO orders (order_number, buyer_id, status, payment_status, total_price, source_id) VALUES 
        ('AM1', $1, 'Виконується', 'Оплачено', 450.00, $2)
        RETURNING id;
      `, [buyer1Id, sourceId]);
      const orderId = orderRes.rows[0].id;

      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
        ($1, $2, 1, 450.00);
      `, [orderId, product1Id]);

      console.log("✅ Mock data seeded successfully.");
    } else {
      console.log("ℹ️ Tables already contain data, skipping seed.");
    }
  } catch (seedErr) {
    console.error("❌ Error seeding data:", seedErr.message);
  }

  await client.end();
  console.log("Done.");
}

main().catch(console.error);
