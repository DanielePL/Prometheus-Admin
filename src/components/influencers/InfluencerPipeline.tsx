import { useMemo } from "react";
import { useInfluencers, useUpdateInfluencerStatus } from "@/hooks/useInfluencers";
import { InfluencerCard } from "./InfluencerCard";
import type { InfluencerStatus, Influencer } from "@/api/types/influencers";
import { cn } from "@/lib/utils";

const PIPELINE_COLUMNS: { status: InfluencerStatus; label: string; color: string }[] = [
  { status: "pending", label: "Pending", color: "bg-blue-500" },
  { status: "contacted", label: "Contacted", color: "bg-yellow-500" },
  { status: "approved", label: "Approved", color: "bg-green-500" },
  { status: "rejected", label: "Rejected", color: "bg-red-500" },
];

interface InfluencerPipelineProps {
  searchQuery: string;
  categoryFilter: string;
  contactFilter: string;
}

export function InfluencerPipeline({
  searchQuery,
  categoryFilter,
  contactFilter,
}: InfluencerPipelineProps) {
  const { data: influencers, isLoading } = useInfluencers();
  const updateStatus = useUpdateInfluencerStatus();

  const filteredInfluencers = useMemo(() => {
    if (!influencers) return [];

    return influencers.filter((influencer) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          influencer.instagram_handle.toLowerCase().includes(query) ||
          influencer.full_name.toLowerCase().includes(query) ||
          (influencer.email?.toLowerCase().includes(query) ?? false);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter && influencer.category !== categoryFilter) {
        return false;
      }

      // Contact person filter
      if (contactFilter && influencer.contact_person !== contactFilter) {
        return false;
      }

      return true;
    });
  }, [influencers, searchQuery, categoryFilter, contactFilter]);

  const getInfluencersByStatus = (status: InfluencerStatus): Influencer[] => {
    return filteredInfluencers.filter((i) => i.status === status);
  };

  const handleStatusChange = (influencerId: string, newStatus: InfluencerStatus) => {
    updateStatus.mutate({ id: influencerId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {PIPELINE_COLUMNS.map((col) => (
          <div key={col.status} className="space-y-3">
            <div className="h-10 rounded-lg bg-card animate-pulse" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 overflow-x-auto pb-4">
      {PIPELINE_COLUMNS.map((column) => {
        const columnInfluencers = getInfluencersByStatus(column.status);

        return (
          <div key={column.status} className="min-w-[250px]">
            {/* Column Header */}
            <div className="mb-3 flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", column.color)} />
              <span className="font-semibold">{column.label}</span>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                {columnInfluencers.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="space-y-3">
              {columnInfluencers.map((influencer) => (
                <InfluencerCard
                  key={influencer.id}
                  influencer={influencer}
                  onStatusChange={(status) => handleStatusChange(influencer.id, status)}
                />
              ))}

              {columnInfluencers.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-muted p-4 text-center text-sm text-muted-foreground">
                  No influencers
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
