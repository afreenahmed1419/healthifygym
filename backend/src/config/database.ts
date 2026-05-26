import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let _client: SupabaseClient | null = null;

export function getDB(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false },
  });
  return _client;
}
