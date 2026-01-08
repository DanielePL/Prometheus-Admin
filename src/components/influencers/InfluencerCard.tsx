import { useState } from "react";
import { Instagram, Users, TrendingUp, MoreVertical, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfluencerDetailModal } from "./InfluencerDetailModal";
import type { Influencer, InfluencerStatus } from "@/api/types/influencers";
import { CATEGORY_LABELS } from "@/api/types/influencers";

interface InfluencerCardProps {
  influencer: Influencer;
  onStatusChange: (status: InfluencerStatus) => void;
}

const STATUS_OPTIONS: { value: InfluencerStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function InfluencerCard({ influencer, onStatusChange }: InfluencerCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formattedFollowers =
    influencer.follower_count >= 1000000
      ? `${(influencer.follower_count / 1000000).toFixed(1)}M`
      : influencer.follower_count >= 1000
      ? `${(influencer.follower_count / 1000).toFixed(0)}K`
      : influencer.follower_count.toString();

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="cursor-pointer rounded-xl bg-card p-4 transition-all hover:bg-card/80 hover:shadow-lg"
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Instagram className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-sm line-clamp-1">
                {influencer.instagram_handle}
              </h4>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {influencer.full_name}
              </span>
            </div>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-6 z-10 min-w-[120px] rounded-lg bg-card border border-muted p-1 shadow-lg">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(option.value);
                      setShowMenu(false);
                    }}
                    className="block w-full rounded px-3 py-1.5 text-left text-sm hover:bg-muted"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3" />
            <span>{formattedFollowers} followers</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            <span>{influencer.engagement_rate.toFixed(1)}% engagement</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-muted pt-3">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {CATEGORY_LABELS[influencer.category]}
          </span>
          {influencer.contact_person && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <UserCircle className="h-3 w-3" />
              <span>{influencer.contact_person}</span>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <InfluencerDetailModal
        influencer={influencer}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </>
  );
}
