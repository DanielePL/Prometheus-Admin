import { useMemo } from "react";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { useInfluencers } from "@/hooks/useInfluencers";
import { calculatePromoReach } from "@/api/types/influencers";

export function InfluencerStats() {
  const { data: influencers, isLoading } = useInfluencers();

  const stats = useMemo(() => {
    if (!influencers) {
      return {
        total: 0,
        pending: 0,
        contacted: 0,
        approved: 0,
        rejected: 0,
        totalReach: 0,
        avgEngagement: 0,
      };
    }

    const pending = influencers.filter((i) => i.status === "pending").length;
    const contacted = influencers.filter((i) => i.status === "contacted").length;
    const approved = influencers.filter((i) => i.status === "approved").length;
    const rejected = influencers.filter((i) => i.status === "rejected").length;

    const totalReach = influencers
      .filter((i) => i.status === "approved")
      .reduce((sum, i) => sum + calculatePromoReach(i.follower_count, i.engagement_rate), 0);

    const avgEngagement =
      influencers.length > 0
        ? influencers.reduce((sum, i) => sum + i.engagement_rate, 0) / influencers.length
        : 0;

    return {
      total: influencers.length,
      pending,
      contacted,
      approved,
      rejected,
      totalReach,
      avgEngagement,
    };
  }, [influencers]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Influencers",
      value: stats.total,
      icon: Users,
      color: "bg-primary",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "bg-blue-500",
    },
    {
      label: "Contacted",
      value: stats.contacted,
      icon: Users,
      color: "bg-yellow-500",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      label: "Potential Reach",
      value: stats.totalReach >= 1000000
        ? `${(stats.totalReach / 1000000).toFixed(1)}M`
        : stats.totalReach >= 1000
        ? `${(stats.totalReach / 1000).toFixed(0)}K`
        : stats.totalReach.toString(),
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat) => (
        <div key={stat.label} className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
            >
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
