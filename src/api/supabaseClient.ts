import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isConfigured) {
  console.warn("⚠️ Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env");
}

// Singleton pattern to prevent multiple GoTrueClient instances
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'prometheus-auth',
      },
    });
  }

  return supabaseInstance;
}

export const supabase = getSupabaseClient();

export { isConfigured as isSupabaseConfigured };
