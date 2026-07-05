import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!PUBLIC_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE credentials in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(PUBLIC_URL, SERVICE_KEY);

async function clearData() {
  console.log("Clearing CRM data...");
  try {
    const { error: err1 } = await supabaseAdmin.from('leads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err1) console.error("Error clearing leads:", err1.message);
    else console.log("✅ Leads cleared.");

    const { error: err2 } = await supabaseAdmin.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err2) console.error("Error clearing notifications:", err2.message);
    else console.log("✅ Notifications cleared.");
    
    console.log("CRM reset successfully.");
  } catch (e) {
    console.error(e);
  }
}

clearData();
