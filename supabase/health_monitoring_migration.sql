-- =====================================================
-- Supabase Health Monitoring RPC Functions
-- Run this in the Supabase Dashboard SQL Editor
-- =====================================================

-- 1. Database Overview Health
CREATE OR REPLACE FUNCTION get_database_health()
RETURNS TABLE (
  db_size_mb numeric,
  cache_hit_ratio numeric,
  total_connections bigint,
  active_connections bigint,
  total_transactions bigint,
  stats_reset timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    round(pg_database_size(current_database()) / 1024.0 / 1024.0, 2) AS db_size_mb,
    round(
      COALESCE(
        (SELECT
          sum(blks_hit)::numeric / NULLIF(sum(blks_hit) + sum(blks_read), 0) * 100
        FROM pg_stat_database
        WHERE datname = current_database()),
        0
      ), 2
    ) AS cache_hit_ratio,
    (SELECT count(*) FROM pg_stat_activity) AS total_connections,
    (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') AS active_connections,
    COALESCE(
      (SELECT xact_commit FROM pg_stat_database WHERE datname = current_database()),
      0
    ) AS total_transactions,
    (SELECT s.stats_reset FROM pg_stat_database s WHERE s.datname = current_database()) AS stats_reset;
END;
$$;

-- 2. Per-Table Health Stats
CREATE OR REPLACE FUNCTION get_table_health()
RETURNS TABLE (
  table_name text,
  schema_name text,
  row_count bigint,
  dead_tuples bigint,
  dead_ratio numeric,
  table_size_bytes bigint,
  table_size_display text,
  heap_blks_read bigint,
  heap_blks_hit bigint,
  table_cache_hit_ratio numeric,
  last_vacuum timestamptz,
  last_analyze timestamptz,
  seq_scan bigint,
  idx_scan bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.relname::text AS table_name,
    s.schemaname::text AS schema_name,
    s.n_live_tup AS row_count,
    s.n_dead_tup AS dead_tuples,
    round(
      CASE
        WHEN (s.n_live_tup + s.n_dead_tup) = 0 THEN 0
        ELSE s.n_dead_tup::numeric / (s.n_live_tup + s.n_dead_tup) * 100
      END, 2
    ) AS dead_ratio,
    pg_total_relation_size(s.relid) AS table_size_bytes,
    pg_size_pretty(pg_total_relation_size(s.relid)) AS table_size_display,
    COALESCE(io.heap_blks_read, 0) AS heap_blks_read,
    COALESCE(io.heap_blks_hit, 0) AS heap_blks_hit,
    round(
      CASE
        WHEN COALESCE(io.heap_blks_hit, 0) + COALESCE(io.heap_blks_read, 0) = 0 THEN 0
        ELSE io.heap_blks_hit::numeric / (io.heap_blks_hit + io.heap_blks_read) * 100
      END, 2
    ) AS table_cache_hit_ratio,
    COALESCE(s.last_vacuum, s.last_autovacuum) AS last_vacuum,
    COALESCE(s.last_analyze, s.last_autoanalyze) AS last_analyze,
    s.seq_scan,
    COALESCE(s.idx_scan, 0) AS idx_scan
  FROM pg_stat_user_tables s
  LEFT JOIN pg_statio_user_tables io ON s.relid = io.relid
  ORDER BY pg_total_relation_size(s.relid) DESC;
END;
$$;

-- 3. Index Health Stats
CREATE OR REPLACE FUNCTION get_index_health()
RETURNS TABLE (
  index_name text,
  table_name text,
  index_size_bytes bigint,
  index_size_display text,
  idx_scan bigint,
  is_unused boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.indexrelname::text AS index_name,
    i.relname::text AS table_name,
    pg_relation_size(i.indexrelid) AS index_size_bytes,
    pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size_display,
    i.idx_scan,
    (i.idx_scan = 0) AS is_unused
  FROM pg_stat_user_indexes i
  ORDER BY pg_relation_size(i.indexrelid) DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_database_health() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_table_health() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_index_health() TO authenticated, anon;
