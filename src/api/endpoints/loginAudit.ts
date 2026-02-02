import { supabase, isSupabaseConfigured } from "../supabaseClient";
import type {
  LoginAuditLog,
  LoginAuditFilters,
  CreateLoginAuditInput,
  LoginAuditStats,
} from "../types/loginAudit";

const TABLE_NAME = "login_audit_logs";

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase not configured");
  }
  return supabase;
}

export const loginAuditEndpoints = {
  /**
   * Log a login attempt (success or failed)
   */
  logLoginAttempt: async (
    input: CreateLoginAuditInput
  ): Promise<{ success: boolean; log?: LoginAuditLog }> => {
    console.log("[LoginAudit Endpoint] isSupabaseConfigured:", isSupabaseConfigured);
    console.log("[LoginAudit Endpoint] supabase client:", supabase ? "exists" : "null");

    if (!isSupabaseConfigured) {
      console.warn("[LoginAudit Endpoint] Supabase not configured, skipping login audit log");
      return { success: false };
    }

    const client = requireSupabase();
    console.log("[LoginAudit Endpoint] Inserting:", input);

    const { data, error } = await client
      .from(TABLE_NAME)
      .insert({
        email: input.email,
        account_name: input.account_name || null,
        status: input.status,
        ip_address: input.ip_address || null,
        user_agent: input.user_agent || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[LoginAudit Endpoint] Failed to log login attempt:", error);
      return { success: false };
    }

    console.log("[LoginAudit Endpoint] Success! Data:", data);
    return { success: true, log: data };
  },

  /**
   * Get login audit logs with optional filters
   */
  getLoginAuditLogs: async (
    filters?: LoginAuditFilters
  ): Promise<LoginAuditLog[]> => {
    if (!isSupabaseConfigured) return [];

    const client = requireSupabase();
    let query = client
      .from(TABLE_NAME)
      .select("*")
      .order("attempted_at", { ascending: false });

    // Apply filters
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.email) {
      query = query.ilike("email", `%${filters.email}%`);
    }

    if (filters?.days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filters.days);
      query = query.gte("attempted_at", cutoffDate.toISOString());
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Get login audit statistics
   */
  getLoginAuditStats: async (days = 30): Promise<LoginAuditStats> => {
    if (!isSupabaseConfigured) {
      return {
        total: 0,
        successful: 0,
        failed: 0,
        last24h: 0,
        failedLast24h: 0,
        uniqueEmails: 0,
      };
    }

    const client = requireSupabase();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data, error } = await client
      .from(TABLE_NAME)
      .select("email, status, attempted_at")
      .gte("attempted_at", cutoffDate.toISOString());

    if (error) throw error;

    const logs = data || [];
    const uniqueEmails = new Set(logs.map((l) => l.email));

    const last24hLogs = logs.filter(
      (l) => new Date(l.attempted_at) >= yesterday
    );

    return {
      total: logs.length,
      successful: logs.filter((l) => l.status === "success").length,
      failed: logs.filter((l) => l.status !== "success").length,
      last24h: last24hLogs.length,
      failedLast24h: last24hLogs.filter((l) => l.status !== "success").length,
      uniqueEmails: uniqueEmails.size,
    };
  },
};
