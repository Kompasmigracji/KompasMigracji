import { createClient } from '@supabase/supabase-js';

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!PUBLIC_URL || !PUBLIC_ANON_KEY) {
  console.warn('Supabase public credentials not configured. Client features will be disabled.');
}

export const supabase = PUBLIC_URL && PUBLIC_ANON_KEY ? createClient(PUBLIC_URL, PUBLIC_ANON_KEY) : null;

// Server-side / admin client (use `SUPABASE_SERVICE_KEY` in production envs)
export const supabaseAdmin = PUBLIC_URL && SERVICE_KEY ? createClient(PUBLIC_URL, SERVICE_KEY) : null;

export function getSupabase() {
  return supabase;
}

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    console.warn('Supabase admin client not configured. Set SUPABASE_SERVICE_KEY for server-side admin operations.');
  }
  return supabaseAdmin;
}
