// =====================================================
// Database Health Types
// =====================================================

export interface DatabaseHealth {
  db_size_mb: number;
  cache_hit_ratio: number;
  total_connections: number;
  active_connections: number;
  total_transactions: number;
  stats_reset: string | null;
}

export interface TableHealth {
  table_name: string;
  schema_name: string;
  row_count: number;
  dead_tuples: number;
  dead_ratio: number;
  table_size_bytes: number;
  table_size_display: string;
  heap_blks_read: number;
  heap_blks_hit: number;
  table_cache_hit_ratio: number;
  last_vacuum: string | null;
  last_analyze: string | null;
  seq_scan: number;
  idx_scan: number;
}

export interface IndexHealth {
  index_name: string;
  table_name: string;
  index_size_bytes: number;
  index_size_display: string;
  idx_scan: number;
  is_unused: boolean;
}

export type HealthStatus = "healthy" | "warning" | "critical";

// =====================================================
// Health Status Helpers
// =====================================================

export function getHealthStatus(cacheHitRatio: number): HealthStatus {
  if (cacheHitRatio >= 99) return "healthy";
  if (cacheHitRatio >= 95) return "warning";
  return "critical";
}

export function getDeadTupleStatus(deadRatio: number): HealthStatus {
  if (deadRatio < 5) return "healthy";
  if (deadRatio < 10) return "warning";
  return "critical";
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const HEALTH_STATUS_CONFIG: Record<HealthStatus, { label: string; color: string; bg: string }> = {
  healthy: { label: "Healthy", color: "text-green-500", bg: "bg-green-500/20" },
  warning: { label: "Warning", color: "text-yellow-500", bg: "bg-yellow-500/20" },
  critical: { label: "Critical", color: "text-destructive", bg: "bg-destructive/20" },
};
