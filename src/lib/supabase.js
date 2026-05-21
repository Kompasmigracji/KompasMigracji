import { createClient } from '@supabase/supabase-js';

// Legacy Vite envs (import.meta.env) are preferred for the old SPA,
// but fall back to Next-style env names when present.
const url = (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || process.env.NEXT_PUBLIC_SUPABASE_URL || null;
const key = (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

export const supabase = url && key ? createClient(url, key) : null;
