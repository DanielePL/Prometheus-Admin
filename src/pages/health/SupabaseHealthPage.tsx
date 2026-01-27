import {
  HardDrive,
  Zap,
  Network,
  Activity,
  RefreshCw,
  AlertTriangle,
  Table2,
  ListTree,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDatabaseHealth,
  useTableHealth,
  useIndexHealth,
} from "@/hooks/useSupabaseHealth";
import {
  formatBytes,
  getHealthStatus,
  getDeadTupleStatus,
  HEALTH_STATUS_CONFIG,
} from "@/api/types/supabaseHealth";
import type { HealthStatus } from "@/api/types/supabaseHealth";
import { formatDistanceToNow } from "date-fns";

// =====================================================
// Helper Components
// =====================================================

function StatusBadge({ status }: { status: HealthStatus }) {
  const config = HEALTH_STATUS_CONFIG[status];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      {config.label}
    </span>
  );
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "Never";
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

// =====================================================
// Main Page Component
// =====================================================

export function SupabaseHealthPage() {
  const {
    data: dbHealth,
    isLoading: dbLoading,
    error: dbError,
    refetch: refetchDb,
    dataUpdatedAt: dbUpdatedAt,
  } = useDatabaseHealth();

  const {
    data: tables,
    isLoading: tablesLoading,
    error: tablesError,
    refetch: refetchTables,
  } = useTableHealth();

  const {
    data: indexes,
    isLoading: indexesLoading,
    error: indexesError,
    refetch: refetchIndexes,
  } = useIndexHealth();

  const isLoading = dbLoading || tablesLoading || indexesLoading;
  const hasError = dbError || tablesError || indexesError;
  const hasData = dbHealth && dbHealth.db_size_mb > 0;

  const handleRefresh = () => {
    refetchDb();
    refetchTables();
    refetchIndexes();
  };

  // Compute alerts
  const alerts: { message: string; status: HealthStatus }[] = [];
  if (dbHealth && dbHealth.cache_hit_ratio > 0 && dbHealth.cache_hit_ratio < 99) {
    alerts.push({
      message: `Cache hit ratio is ${dbHealth.cache_hit_ratio.toFixed(1)}% (target: >= 99%)`,
      status: getHealthStatus(dbHealth.cache_hit_ratio),
    });
  }
  if (dbHealth && dbHealth.total_connections > 0) {
    const connRatio = dbHealth.active_connections / dbHealth.total_connections;
    if (connRatio > 0.8) {
      alerts.push({
        message: `Active connections at ${(connRatio * 100).toFixed(0)}% capacity (${dbHealth.active_connections}/${dbHealth.total_connections})`,
        status: "warning",
      });
    }
  }
  if (tables) {
    for (const t of tables) {
      if (t.dead_ratio >= 10) {
        alerts.push({
          message: `Table "${t.table_name}" has ${t.dead_ratio.toFixed(1)}% dead tuples — consider VACUUM`,
          status: "critical",
        });
      }
    }
  }
  if (indexes) {
    const unusedCount = indexes.filter((i) => i.is_unused).length;
    if (unusedCount > 0) {
      alerts.push({
        message: `${unusedCount} unused index${unusedCount > 1 ? "es" : ""} detected (0 scans)`,
        status: "warning",
      });
    }
  }

  // Sort tables by size desc
  const sortedTables = tables ? [...tables].sort((a, b) => b.table_size_bytes - a.table_size_bytes) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Supabase Health</h1>
          <p className="text-muted-foreground text-lg">
            Database health monitoring
            {dbUpdatedAt > 0 && (
              <span className="ml-2 text-sm">
                Last refresh: {formatDistanceToNow(new Date(dbUpdatedAt), { addSuffix: true })}
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Health Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => {
            const config = HEALTH_STATUS_CONFIG[alert.status];
            return (
              <div key={i} className={`glass rounded-2xl p-4 border ${alert.status === "critical" ? "border-destructive/20 bg-destructive/5" : "border-yellow-500/20 bg-yellow-500/5"}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${config.color}`} />
                  <p className="text-sm font-medium">{alert.message}</p>
                  <StatusBadge status={alert.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Database Size */}
        <div className="glass rounded-2xl p-5 transition-smooth hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-500">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Database Size</p>
              {dbLoading ? (
                <Skeleton className="h-7 w-20 mt-1" />
              ) : (
                <p className="text-xl font-bold">
                  {dbHealth ? `${dbHealth.db_size_mb.toFixed(1)} MB` : "—"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cache Hit Ratio */}
        <div className="glass rounded-2xl p-5 transition-smooth hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              dbHealth
                ? HEALTH_STATUS_CONFIG[getHealthStatus(dbHealth.cache_hit_ratio)].bg + " " + HEALTH_STATUS_CONFIG[getHealthStatus(dbHealth.cache_hit_ratio)].color
                : "bg-green-500/20 text-green-500"
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cache Hit Ratio</p>
              {dbLoading ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">
                    {dbHealth ? `${dbHealth.cache_hit_ratio.toFixed(1)}%` : "—"}
                  </p>
                  {dbHealth && dbHealth.cache_hit_ratio > 0 && (
                    <StatusBadge status={getHealthStatus(dbHealth.cache_hit_ratio)} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Connections */}
        <div className="glass rounded-2xl p-5 transition-smooth hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/20 text-purple-500">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connections</p>
              {dbLoading ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-xl font-bold">
                  {dbHealth ? `${dbHealth.active_connections} / ${dbHealth.total_connections}` : "—"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="glass rounded-2xl p-5 transition-smooth hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/20 text-orange-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              {dbLoading ? (
                <Skeleton className="h-7 w-24 mt-1" />
              ) : (
                <p className="text-xl font-bold">
                  {dbHealth ? dbHealth.total_transactions.toLocaleString() : "—"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Health Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Table2 className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">Tables</h2>
          {!tablesLoading && sortedTables.length > 0 && (
            <span className="text-sm text-muted-foreground">({sortedTables.length})</span>
          )}
        </div>

        {tablesLoading ? (
          <>
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </>
        ) : sortedTables.length > 0 ? (
          sortedTables.map((table) => {
            const deadStatus = getDeadTupleStatus(table.dead_ratio);
            return (
              <div
                key={`${table.schema_name}.${table.table_name}`}
                className="glass rounded-2xl p-5 transition-smooth hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
              >
                <div className="flex flex-col gap-4">
                  {/* Table header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{table.table_name}</p>
                      <p className="text-xs text-muted-foreground">{table.schema_name}</p>
                    </div>
                    <p className="text-lg font-bold">{table.table_size_display}</p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Rows</p>
                      <p className="text-sm font-medium">{table.row_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dead Tuples</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{table.dead_tuples.toLocaleString()}</p>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${HEALTH_STATUS_CONFIG[deadStatus].bg} ${HEALTH_STATUS_CONFIG[deadStatus].color}`}>
                          {table.dead_ratio.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cache Hit</p>
                      <p className="text-sm font-medium">{table.table_cache_hit_ratio.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Seq / Idx Scans</p>
                      <p className="text-sm font-medium">
                        {table.seq_scan.toLocaleString()} / {table.idx_scan.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Vacuum</p>
                      <p className="text-sm font-medium">{formatRelativeTime(table.last_vacuum)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Analyze</p>
                      <p className="text-sm font-medium">{formatRelativeTime(table.last_analyze)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <Table2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-bold mb-2">No Tables Found</h3>
            <p className="text-muted-foreground">
              Run the health monitoring SQL functions in your Supabase Dashboard first.
            </p>
          </div>
        )}
      </div>

      {/* Index Health Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ListTree className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">Indexes</h2>
          {!indexesLoading && indexes && indexes.length > 0 && (
            <span className="text-sm text-muted-foreground">({indexes.length})</span>
          )}
        </div>

        {indexesLoading ? (
          <>
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </>
        ) : indexes && indexes.length > 0 ? (
          indexes.map((index) => (
            <div
              key={index.index_name}
              className="glass rounded-2xl p-5 transition-smooth hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold truncate">{index.index_name}</p>
                    {index.is_unused && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500">
                        Unused
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{index.table_name}</p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-sm font-bold">{index.index_size_display}</p>
                    <p className="text-xs text-muted-foreground">Size</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{index.idx_scan.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Scans</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <ListTree className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-bold mb-2">No Indexes Found</h3>
            <p className="text-muted-foreground">
              Run the health monitoring SQL functions in your Supabase Dashboard first.
            </p>
          </div>
        )}
      </div>

      {/* Status Notice */}
      {hasData ? (
        <div className="glass rounded-2xl p-4 border border-green-500/20 bg-green-500/5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-500">RPC functions connected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Health data is loaded live from Supabase via SECURITY DEFINER RPC functions.
                {dbHealth?.stats_reset && (
                  <span> Stats since {formatRelativeTime(dbHealth.stats_reset)}.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : !isLoading && (
        <div className="glass rounded-2xl p-4 border border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-500">RPC functions not available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Run the health monitoring SQL migration in your Supabase Dashboard SQL Editor to enable live data.
                {hasError && (
                  <span className="block mt-1 text-destructive">
                    Error: {(dbError || tablesError || indexesError)?.toString()}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
