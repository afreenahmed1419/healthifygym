import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// ─── Browser / client-side client (lazy singleton) ───────────────────────────
let _client: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase public env vars");
  _client = createClient<Database>(url, key);
  return _client;
}

// Convenience export — matches existing usage in db.ts
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient<Database>];
  },
});

// ─── Server-side admin client (service role) ─────────────────────────────────
// Only for API routes / Server Actions. Never expose to the browser.
export function getAdminClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Missing Supabase server env vars");
  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
