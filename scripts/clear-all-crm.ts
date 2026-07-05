import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function clearCRM() {
  console.log("Connecting to PostgreSQL...");
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: { rejectUnauthorized: false }
  });

  const tablesToTruncate = [
    'leads', 'notifications', 'tasks', 'task_logs', 'task_documents', 'task_ai_chat',
    'cases', 'case_logs', 'case_documents', 'case_billing', 'case_status_history', 'case_activities', 'case_sla_events',
    'orders', 'order_items', 'buyers', 'products', 'sources', 'custom_payments',
    'custom_chats', 'custom_messages', 'kompas_leads', 'kompas_cases', 'kompas_deals',
    'kompas_invoices', 'kompas_expenses', 'kompas_activities', 'kompas_files', 'kompas_reports', 'kompas_emails',
    'immigration_cases', 'enforcement_cases', 'enforcement_case_logs'
  ];

  try {
    await client.connect();
    console.log("Connected. Truncating CRM tables...");
    
    for (const table of tablesToTruncate) {
      try {
        await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
        console.log(`✅ Truncated ${table}`);
      } catch (e) {
        console.log(`⚠️ Could not truncate ${table}: ${e.message}`);
      }
    }

    console.log("CRM fully reset successfully.");
  } catch (e) {
    console.error("Database error:", e);
  } finally {
    await client.end();
  }
}

clearCRM();
