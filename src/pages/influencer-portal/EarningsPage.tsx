import { useState } from "react";
import { DollarSign, Clock, CheckCircle, Wallet, TrendingUp } from "lucide-react";
import { useInfluencerEarnings, useInfluencerStats, useInfluencerPayoutHistory } from "@/hooks/useInfluencerPortal";
import { CURRENCY } from "@/api/types/influencerPortal";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | "pending" | "approved" | "paid";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
  approved: { label: "Approved", color: "bg-green-500/10 text-green-500", icon: CheckCircle },
  paid: { label: "Paid", color: "bg-blue-500/10 text-blue-500", icon: Wallet },
};

const TYPE_LABELS = {
  conversion: "Conversion",
  bonus: "Bonus",
  adjustment: "Adjustment",
};

export default function EarningsPage() {
  const { data: stats } = useInfluencerStats();
  const { data: earnings, isLoading: earningsLoading } = useInfluencerEarnings();
  const { data: payouts } = useInfluencerPayoutHistory();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const filteredEarnings = earnings?.filter((e) =>
    statusFilter === "all" ? true : e.status === statusFilter
  );

  const statusCounts = {
    all: earnings?.length || 0,
    pending: earnings?.filter((e) => e.status === "pending").length || 0,
    approved: earnings?.filter((e) => e.status === "approved").length || 0,
    paid: earnings?.filter((e) => e.status === "paid").length || 0,
  };

  const lastPayout = payouts?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">
          Track your earnings and payout history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-lg p-2 bg-gradient-to-br from-green-500 to-emerald-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">Total Earned</span>
          </div>
          <p className="text-2xl font-bold">
            {CURRENCY} {stats?.total_earnings.toFixed(2) || "0.00"}
          </p>
        </div>

        <div className="rounded-xl bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-lg p-2 bg-gradient-to-br from-yellow-500 to-orange-600">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <p className="text-2xl font-bold">
            {CURRENCY} {stats?.pending_earnings.toFixed(2) || "0.00"}
          </p>
        </div>

        <div className="rounded-xl bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-lg p-2 bg-gradient-to-br from-blue-500 to-cyan-600">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">Last Payout</span>
          </div>
          <p className="text-2xl font-bold">
            {lastPayout
              ? `${CURRENCY} ${lastPayout.amount.toFixed(2)}`
              : "-"}
          </p>
          {lastPayout && (
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(lastPayout.process_date || lastPayout.request_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Earnings List */}
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Earnings History</h2>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["all", "pending", "approved", "paid"] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 opacity-70">({statusCounts[status]})</span>
            </button>
          ))}
        </div>

        {earningsLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredEarnings && filteredEarnings.length > 0 ? (
          <div className="space-y-3">
            {filteredEarnings.map((entry) => {
              const status = STATUS_CONFIG[entry.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg bg-background/50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{entry.campaign_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {TYPE_LABELS[entry.type]} •{" "}
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-green-500">
                      +{CURRENCY} {entry.amount.toFixed(2)}
                    </p>
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        status.color
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="font-medium">No earnings yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start promoting to earn commissions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
