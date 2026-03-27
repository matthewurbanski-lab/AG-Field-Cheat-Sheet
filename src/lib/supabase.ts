import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client (uses anon key, RLS enforced)
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anonKey);
}

// Server-side Supabase client (uses service key, bypasses RLS)
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY!;
  return createClient(url, serviceKey);
}
