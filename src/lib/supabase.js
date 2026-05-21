import { createClient } from '@supabase/supabase-js';

// Legacy Vite envs (import.meta.env) are preferred for the old SPA,
// but fall back to Next-style env names when present.
let url = null;
let key = null;
try {
	// In Vite/browser builds, import.meta.env will be available
	url = import.meta.env.VITE_SUPABASE_URL;
	key = import.meta.env.VITE_SUPABASE_ANON_KEY;
} catch (e) {
	// ignore — import.meta may be unavailable in some runtimes
}

url = url || process.env.NEXT_PUBLIC_SUPABASE_URL || null;
key = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

export const supabase = url && key ? createClient(url, key) : null;
