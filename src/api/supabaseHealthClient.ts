import { supabase, isSupabaseConfigured } from "./supabaseClient";
import type { DatabaseHealth, TableHealth, IndexHealth } from "./types";

// Helper to check if Supabase is available
function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
  }
  return supabase;
}

// =====================================================
// Database Health API
// =====================================================

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  const client = requireSupabase();
  const { data, error } = await client.rpc("get_database_health");

  if (error) {
    // Fallback: return zeroed-out stats if RPC doesn't exist
    console.warn("get_database_health RPC not available:", error.message);
    return {
      db_size_mb: 0,
      cache_hit_ratio: 0,
      total_connections: 0,
      active_connections: 0,
      total_transactions: 0,
      stats_reset: null,
    };
  }

  // RPC returns an array with one row
  const row = Array.isArray(data) ? data[0] : data;
  return row as DatabaseHealth;
}

// =====================================================
// Table Health API
// =====================================================

export async function getTableHealth(): Promise<TableHealth[]> {
  if (!isSupabaseConfigured) return [];

  const client = requireSupabase();
  const { data, error } = await client.rpc("get_table_health");

  if (error) {
    console.warn("get_table_health RPC not available:", error.message);
    return [];
  }

  return (data as TableHealth[]) || [];
}

// =====================================================
// Index Health API
// =====================================================

export async function getIndexHealth(): Promise<IndexHealth[]> {
  if (!isSupabaseConfigured) return [];

  const client = requireSupabase();
  const { data, error } = await client.rpc("get_index_health");

  if (error) {
    console.warn("get_index_health RPC not available:", error.message);
    return [];
  }

  return (data as IndexHealth[]) || [];
}
