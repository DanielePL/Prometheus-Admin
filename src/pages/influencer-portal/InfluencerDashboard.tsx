import { DollarSign, TrendingUp, MousePointer, Megaphone, ArrowUp, ArrowDown } from "lucide-react";
import { useInfluencerStats, useInfluencerCampaigns } from "@/hooks/useInfluencerPortal";
import { useInfluencerPortal } from "@/contexts/InfluencerPortalContext";
import { CURRENCY } from "@/api/types/influencerPortal";
import { cn } from "@/lib/utils";

export default function InfluencerDashboard() {
  const { influencer } = useInfluencerPortal();
  const { data: stats, isLoading: statsLoading } = useInfluencerStats();
  const { data: campaigns } = useInfluencerCampaigns("active");

  const statCards = [
    {
      label: "Total Earnings",
      value: stats ? `${CURRENCY} ${stats.total_earnings.toFixed(2)}` : "-",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      change: null,
    },
    {
      label: "Pending Earnings",
      value: stats ? `${CURRENCY} ${stats.pending_earnings.toFixed(2)}` : "-",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-600",
      change: null,
    },
    {
      label: "This Month",
      value: stats ? `${stats.this_month_conversions} conversions` : "-",
      icon: TrendingUp,
      color: "from-primary to-orange-600",
      change: stats?.this_month_conversions ? { value: 12, positive: true } : null,
    },
    {
      label: "Conversion Rate",
      value: stats ? `${stats.conversion_rate.toFixed(1)}%` : "-",
      icon: MousePointer,
      color: "from-blue-500 to-cyan-600",
      change: stats?.conversion_rate ? { value: 0.5, positive: true } : null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <h1 className="text-2xl font-bold">
          Welcome back, {influencer?.name?.split(" ")[0] || "Creator"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("rounded-lg p-2 bg-gradient-to-br", stat.color)}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                {stat.change && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      stat.change.positive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {stat.change.positive ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {stat.change.value}%
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              {statsLoading ? (
                <div className="h-7 w-24 bg-muted animate-pulse rounded mt-1" />
              ) : (
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Campaigns */}
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Active Campaigns</h2>
        </div>

        {campaigns && campaigns.length > 0 ? (
          <div className="space-y-3">
            {campaigns.slice(0, 3).map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between rounded-lg bg-background/50 p-4"
              >
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {campaign.brand} • {campaign.conversions} conversions
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-500">
                    {CURRENCY} {campaign.earnings.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    earned
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Megaphone className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No active campaigns</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Conversions</p>
          {statsLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1" />
          ) : (
            <p className="text-2xl font-bold">{stats?.total_conversions || 0}</p>
          )}
        </div>
        <div className="rounded-xl bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Clicks</p>
          {statsLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1" />
          ) : (
            <p className="text-2xl font-bold">{stats?.total_clicks?.toLocaleString() || 0}</p>
          )}
        </div>
      </div>
    </div>
  );
}
