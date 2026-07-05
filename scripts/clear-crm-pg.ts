import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function clearData() {
  console.log("Connecting to PostgreSQL...");
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected. Clearing data...");
    
    // Truncate leads and notifications
    await client.query('TRUNCATE TABLE leads RESTART IDENTITY CASCADE;');
    console.log("✅ Leads truncated.");
    
    await client.query('TRUNCATE TABLE notifications RESTART IDENTITY CASCADE;');
    console.log("✅ Notifications truncated.");
    
    // Check if chats and orders tables exist and truncate them if necessary
    try {
      await client.query('TRUNCATE TABLE chats RESTART IDENTITY CASCADE;');
      console.log("✅ Chats truncated.");
    } catch (e) {
      console.log("No chats table or could not truncate.", e.message);
    }

    console.log("CRM reset successfully.");
  } catch (e) {
    console.error("Database error:", e);
  } finally {
    await client.end();
  }
}

clearData();
