import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import {
  Shield,
  CheckCircle2,
  XCircle,
  UserX,
  Key,
  Clock,
  Mail,
  Monitor,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoginAuditLogs, useLoginAuditStats } from "@/hooks/useLoginAudit";
import type { LoginAuditStatus, LoginAuditLog } from "@/api/types/loginAudit";

// =============================================================================
// Status Badge Component
// =============================================================================

function StatusBadge({ status }: { status: LoginAuditStatus }) {
  const config = {
    success: {
      icon: CheckCircle2,
      label: "Erfolgreich",
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    failed_not_found: {
      icon: UserX,
      label: "Unbekannt",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    failed_wrong_password: {
      icon: Key,
      label: "Falsches PW",
      className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

// =============================================================================
// Stats Card Component
// =============================================================================

function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  subtitle?: string;
  variant?: "default" | "success" | "danger" | "warning";
}) {
  const variantClasses = {
    default: "bg-background/50",
    success: "bg-emerald-500/5 border-emerald-500/20",
    danger: "bg-red-500/5 border-red-500/20",
    warning: "bg-orange-500/5 border-orange-500/20",
  };

  const iconClasses = {
    default: "text-muted-foreground",
    success: "text-emerald-500",
    danger: "text-red-500",
    warning: "text-orange-500",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 p-4",
        variantClasses[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center bg-white/5",
            iconClasses[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Log Row Component
// =============================================================================

function LogRow({ log }: { log: LoginAuditLog }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <div
        className="flex items-center justify-between py-4 px-4 hover:bg-white/5 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <StatusBadge status={log.status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium truncate">{log.email}</span>
              {log.account_name && (
                <span className="text-muted-foreground text-sm">
                  ({log.account_name})
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {log.ip_address && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span className="font-mono text-xs">{log.ip_address}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span title={format(new Date(log.attempted_at), "PPpp", { locale: de })}>
              {formatDistanceToNow(new Date(log.attempted_at), {
                addSuffix: true,
                locale: de,
              })}
            </span>
          </div>
          {log.user_agent && (
            <button className="text-muted-foreground hover:text-foreground">
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
      {expanded && log.user_agent && (
        <div className="px-4 pb-4 pt-0">
          <div className="bg-background/50 rounded-lg p-3 text-sm">
            <div className="flex items-start gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground break-all">
                {log.user_agent}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main Page Component
// =============================================================================

export function LoginAuditPage() {
  const [statusFilter, setStatusFilter] = useState<LoginAuditStatus | "all">(
    "all"
  );
  const [emailSearch, setEmailSearch] = useState("");
  const [daysFilter, setDaysFilter] = useState(30);

  const { data: stats, isLoading: statsLoading } = useLoginAuditStats(daysFilter);
  const {
    data: logs,
    isLoading: logsLoading,
    refetch,
    isFetching,
  } = useLoginAuditLogs({
    status: statusFilter === "all" ? undefined : statusFilter,
    email: emailSearch || undefined,
    days: daysFilter,
    limit: 100,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Login Audit</h1>
            <p className="text-sm text-muted-foreground">
              Überwachung aller Login-Versuche
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={cn("h-4 w-4", isFetching && "animate-spin")}
          />
          Aktualisieren
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Gesamt-Logins"
          value={stats?.total ?? 0}
          icon={Shield}
          subtitle={`Letzte ${daysFilter} Tage`}
        />
        <StatsCard
          title="Erfolgreich"
          value={stats?.successful ?? 0}
          icon={CheckCircle2}
          variant="success"
          subtitle={`${stats?.total ? Math.round((stats.successful / stats.total) * 100) : 0}% Erfolgsrate`}
        />
        <StatsCard
          title="Fehlgeschlagen"
          value={stats?.failed ?? 0}
          icon={XCircle}
          variant="danger"
          subtitle={`${stats?.failedLast24h ?? 0} in 24h`}
        />
        <StatsCard
          title="Letzte 24h"
          value={stats?.last24h ?? 0}
          icon={Clock}
          variant="warning"
          subtitle={`${stats?.uniqueEmails ?? 0} einzigartige E-Mails`}
        />
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Email Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="E-Mail suchen..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as LoginAuditStatus | "all")
              }
              className="px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">Alle Status</option>
              <option value="success">Erfolgreich</option>
              <option value="failed_not_found">Unbekannte E-Mail</option>
              <option value="failed_wrong_password">Falsches Passwort</option>
            </select>
          </div>

          {/* Days Filter */}
          <select
            value={daysFilter}
            onChange={(e) => setDaysFilter(Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value={7}>Letzte 7 Tage</option>
            <option value={30}>Letzte 30 Tage</option>
            <option value={90}>Letzte 90 Tage</option>
            <option value={365}>Letztes Jahr</option>
          </select>
        </div>
      </div>

      {/* Logs List */}
      <div className="glass rounded-xl">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-medium">Login-Versuche</h2>
        </div>

        {logsLoading || statsLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            Lade Audit-Logs...
          </div>
        ) : logs && logs.length > 0 ? (
          <div className="divide-y divide-white/5">
            {logs.map((log) => (
              <LogRow key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Keine Login-Versuche gefunden
          </div>
        )}
      </div>
    </div>
  );
}
