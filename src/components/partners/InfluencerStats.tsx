import {
  Users,
  Clock,
  Mail,
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  Target,
  DollarSign,
  UserPlus,
} from "lucide-react";
import type { Partner, InfluencerStatus } from "@/api/types/partners";
import { INFLUENCER_STATUS_CONFIG } from "@/api/types/partners";
import { cn } from "@/lib/utils";

interface InfluencerStatsProps {
  influencers: Partner[];
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Status icons mapping
const STATUS_ICONS: Record<InfluencerStatus, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  contacted: <Mail className="w-4 h-4" />,
  approved: <CheckCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

export function InfluencerStats({ influencers }: InfluencerStatsProps) {
  // Calculate stats by status
  const statsByStatus = influencers.reduce(
    (acc, inf) => {
      const status = inf.influencer_status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<InfluencerStatus, number>
  );

  // Calculate totals
  const totalFollowers = influencers.reduce(
    (sum, inf) => sum + (inf.follower_count || 0),
    0
  );

  const avgEngagement =
    influencers.length > 0
      ? influencers.reduce((sum, inf) => sum + (inf.engagement_rate || 0), 0) /
        influencers.filter((inf) => inf.engagement_rate).length || 0
      : 0;

  // Potential reach (followers * avg engagement rate)
  const potentialReach = Math.round(totalFollowers * (avgEngagement / 100));


  return (
    <div className="space-y-4">
      {/* Status Overview */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {(["pending", "contacted", "approved", "rejected"] as InfluencerStatus[]).map(
          (status) => {
            const config = INFLUENCER_STATUS_CONFIG[status];
            const count = statsByStatus[status] || 0;

            return (
              <div
                key={status}
                className={cn(
                  "glass rounded-xl p-4 border-l-4",
                  status === "pending" && "border-l-gray-500",
                  status === "contacted" && "border-l-blue-500",
                  status === "approved" && "border-l-green-500",
                  status === "rejected" && "border-l-red-500"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("p-1.5 rounded-lg", config.bg, config.color)}>
                    {STATUS_ICONS[status]}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {config.label}
                  </span>
                </div>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            );
          }
        )}
      </div>

      {/* Reach & Engagement Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Followers</p>
              <p className="text-xl font-bold">{formatNumber(totalFollowers)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Across {influencers.length} influencers
          </p>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Engagement</p>
              <p className="text-xl font-bold">{avgEngagement.toFixed(1)}%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Industry avg: 1-3%
          </p>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Potential Reach</p>
              <p className="text-xl font-bold">{formatNumber(potentialReach)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Per promo campaign
          </p>
        </div>
      </div>
    </div>
  );
}

// Projection card for revenue estimates
interface RevenueProjectionProps {
  influencers: Partner[];
}

export function RevenueProjection({ influencers }: RevenueProjectionProps) {
  // Only approved influencers count
  const approvedInfluencers = influencers.filter(
    (inf) => inf.influencer_status === "approved"
  );

  const totalFollowers = approvedInfluencers.reduce(
    (sum, inf) => sum + (inf.follower_count || 0),
    0
  );

  const avgEngagement =
    approvedInfluencers.length > 0
      ? approvedInfluencers.reduce((sum, inf) => sum + (inf.engagement_rate || 0), 0) /
        approvedInfluencers.filter((inf) => inf.engagement_rate).length || 0
      : 0;

  // Conversion assumptions
  const conversionRate = 0.02; // 2% of reached audience converts
  const avgSubscriptionValue = 9.99; // App subscription price
  const potentialReach = totalFollowers * (avgEngagement / 100);
  const estimatedConversions = Math.round(potentialReach * conversionRate);
  const estimatedMonthlyRevenue = estimatedConversions * avgSubscriptionValue;
  const estimatedYearlyRevenue = estimatedMonthlyRevenue * 12;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-bold">Revenue Projection</h3>
          <p className="text-sm text-muted-foreground">Based on approved influencers</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-muted/20">
          <span className="text-sm text-muted-foreground">Approved Influencers</span>
          <span className="font-medium">{approvedInfluencers.length}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-muted/20">
          <span className="text-sm text-muted-foreground">Combined Reach</span>
          <span className="font-medium">{formatNumber(totalFollowers)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-muted/20">
          <span className="text-sm text-muted-foreground">Est. Conversions</span>
          <span className="font-medium">{formatNumber(estimatedConversions)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-muted/20">
          <span className="text-sm text-muted-foreground">Monthly Revenue</span>
          <span className="font-bold text-green-500">
            {formatCurrency(estimatedMonthlyRevenue)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-medium">Yearly Projection</span>
          <span className="text-xl font-bold text-green-500">
            {formatCurrency(estimatedYearlyRevenue)}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        * Based on 2% conversion rate and ${avgSubscriptionValue}/mo subscription
      </p>
    </div>
  );
}

// Subscriber projection component
interface SubscriberProjectionProps {
  influencers: Partner[];
}

export function SubscriberProjection({ influencers }: SubscriberProjectionProps) {
  const approvedInfluencers = influencers.filter(
    (inf) => inf.influencer_status === "approved"
  );

  const totalFollowers = approvedInfluencers.reduce(
    (sum, inf) => sum + (inf.follower_count || 0),
    0
  );

  const avgEngagement =
    approvedInfluencers.length > 0
      ? approvedInfluencers.reduce((sum, inf) => sum + (inf.engagement_rate || 0), 0) /
        approvedInfluencers.filter((inf) => inf.engagement_rate).length || 0
      : 0;

  // Projections for different scenarios
  const scenarios = [
    { label: "Conservative (1%)", rate: 0.01 },
    { label: "Moderate (2%)", rate: 0.02 },
    { label: "Optimistic (5%)", rate: 0.05 },
  ];

  const potentialReach = totalFollowers * (avgEngagement / 100);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold">Subscriber Projection</h3>
          <p className="text-sm text-muted-foreground">New users per campaign</p>
        </div>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const subscribers = Math.round(potentialReach * scenario.rate);
          return (
            <div
              key={scenario.label}
              className="flex justify-between items-center py-3 px-4 rounded-xl bg-background/50"
            >
              <span className="text-sm">{scenario.label}</span>
              <span className="font-bold text-lg">{formatNumber(subscribers)}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Target Reach</span>
        </div>
        <p className="text-2xl font-bold text-primary mt-1">
          {formatNumber(potentialReach)}
        </p>
        <p className="text-xs text-muted-foreground">potential impressions</p>
      </div>
    </div>
  );
}

// Top performers component
interface TopPerformersProps {
  influencers: Partner[];
  limit?: number;
}

export function TopPerformers({ influencers, limit = 5 }: TopPerformersProps) {
  // Sort by follower count
  const topInfluencers = [...influencers]
    .sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0))
    .slice(0, limit);

  if (topInfluencers.length === 0) {
    return null;
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-bold">Top Influencers</h3>
          <p className="text-sm text-muted-foreground">By follower count</p>
        </div>
      </div>

      <div className="space-y-2">
        {topInfluencers.map((inf, index) => {
          const statusConfig = INFLUENCER_STATUS_CONFIG[inf.influencer_status || "pending"];
          return (
            <div
              key={inf.id}
              className="flex items-center justify-between p-3 rounded-xl bg-background/50 hover:bg-background/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                    index === 0 && "bg-yellow-500/20 text-yellow-500",
                    index === 1 && "bg-gray-400/20 text-gray-400",
                    index === 2 && "bg-amber-600/20 text-amber-600",
                    index > 2 && "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{inf.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{inf.instagram_handle || "N/A"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatNumber(inf.follower_count || 0)}</p>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    statusConfig.bg,
                    statusConfig.color
                  )}
                >
                  {statusConfig.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
