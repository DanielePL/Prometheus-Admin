import { useState } from "react";
import { Megaphone, ExternalLink, Copy, Check, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInfluencerCampaigns } from "@/hooks/useInfluencerPortal";
import { CURRENCY } from "@/api/types/influencerPortal";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | "active" | "completed" | "upcoming";

const STATUS_CONFIG = {
  active: { label: "Active", color: "bg-green-500/10 text-green-500", icon: CheckCircle },
  completed: { label: "Completed", color: "bg-blue-500/10 text-blue-500", icon: CheckCircle },
  upcoming: { label: "Upcoming", color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
};

export default function CampaignsPage() {
  const { data: campaigns, isLoading } = useInfluencerCampaigns();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCampaigns = campaigns?.filter((c) =>
    statusFilter === "all" ? true : c.status === statusFilter
  );

  const statusCounts = {
    all: campaigns?.length || 0,
    active: campaigns?.filter((c) => c.status === "active").length || 0,
    completed: campaigns?.filter((c) => c.status === "completed").length || 0,
    upcoming: campaigns?.filter((c) => c.status === "upcoming").length || 0,
  };

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <p className="text-muted-foreground">
          View and track your campaign performance
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["all", "active", "completed", "upcoming"] as FilterStatus[]).map((status) => (
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

      {/* Campaigns List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-card animate-pulse rounded-xl" />
          ))
        ) : filteredCampaigns && filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign) => {
            const status = STATUS_CONFIG[campaign.status];
            const StatusIcon = status.icon;

            return (
              <div key={campaign.id} className="rounded-xl bg-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", status.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                    {campaign.brand && (
                      <p className="text-muted-foreground text-sm mt-1">{campaign.brand}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-500">
                      {CURRENCY} {campaign.earnings.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">earned</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Commission</p>
                    <p className="font-medium">
                      {campaign.commission_type === "percentage"
                        ? `${campaign.commission_value}%`
                        : `${CURRENCY} ${campaign.commission_value}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                    <p className="font-medium">{campaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="font-medium text-sm">
                      {new Date(campaign.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End Date</p>
                    <p className="font-medium text-sm">
                      {campaign.end_date
                        ? new Date(campaign.end_date).toLocaleDateString()
                        : "Ongoing"}
                    </p>
                  </div>
                </div>

                {/* Tracking Link */}
                <div className="flex items-center gap-2 rounded-lg bg-background/50 p-3">
                  <code className="flex-1 text-sm font-mono truncate text-muted-foreground">
                    {campaign.tracking_link}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyLink(campaign.tracking_link, campaign.id)}
                  >
                    {copiedId === campaign.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={campaign.tracking_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl bg-card p-12 text-center">
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="font-medium">No campaigns found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {statusFilter === "all"
                ? "You don't have any campaigns yet"
                : `No ${statusFilter} campaigns`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
