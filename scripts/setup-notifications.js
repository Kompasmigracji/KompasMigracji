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
  console.log("Connected to database.");

  // Create notifications table
  await client.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT,
      type VARCHAR(50) DEFAULT 'system',
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Table 'notifications' created or already exists.");

  // Enable realtime replication for the table
  try {
    await client.query(`
      ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    `);
    console.log("Added 'notifications' to supabase_realtime publication.");
  } catch (err) {
    if (err.message.includes("already in publication")) {
      console.log("Table 'notifications' is already in supabase_realtime.");
    } else {
      console.error("Warning: could not add to publication:", err.message);
    }
  }

  await client.end();
}

main().catch(console.error);
