import { useState } from "react";
import {
  X,
  Instagram,
  User,
  Mail,
  Users,
  TrendingUp,
  Tag,
  UserCircle,
  Calendar,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeleteInfluencer, useUpdateInfluencerStatus } from "@/hooks/useInfluencers";
import {
  STATUS_CONFIG,
  CATEGORY_LABELS,
  calculatePromoReach,
  type Influencer,
  type InfluencerStatus,
} from "@/api/types/influencers";
import { InfluencerForm } from "./InfluencerForm";

interface InfluencerDetailModalProps {
  influencer: Influencer;
  isOpen: boolean;
  onClose: () => void;
}

export function InfluencerDetailModal({
  influencer,
  isOpen,
  onClose,
}: InfluencerDetailModalProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const deleteInfluencer = useDeleteInfluencer();
  const updateStatus = useUpdateInfluencerStatus();

  const reach = calculatePromoReach(influencer.follower_count, influencer.engagement_rate);
  const formattedFollowers =
    influencer.follower_count >= 1000000
      ? `${(influencer.follower_count / 1000000).toFixed(1)}M`
      : influencer.follower_count >= 1000
      ? `${(influencer.follower_count / 1000).toFixed(0)}K`
      : influencer.follower_count.toString();
  const formattedReach =
    reach >= 1000000
      ? `${(reach / 1000000).toFixed(1)}M`
      : reach >= 1000
      ? `${(reach / 1000).toFixed(0)}K`
      : reach.toString();

  const handleDelete = () => {
    if (window.confirm("Really delete this influencer?")) {
      deleteInfluencer.mutate(influencer.id, {
        onSuccess: () => onClose(),
      });
    }
  };

  const handleStatusChange = (status: InfluencerStatus) => {
    updateStatus.mutate({ id: influencer.id, status });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  const statusConfig = STATUS_CONFIG[influencer.status];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />

        {/* Modal */}
        <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-background shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-muted p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{influencer.instagram_handle}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn("h-2 w-2 rounded-full", statusConfig.color)} />
                  <span className="text-sm text-muted-foreground">
                    {statusConfig.label}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
            {/* Status Pipeline */}
            <div className="space-y-3">
              <h3 className="font-semibold">Status</h3>
              <div className="flex gap-2">
                {(["pending", "contacted", "approved", "rejected"] as InfluencerStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={cn(
                        "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
                        influencer.status === status
                          ? STATUS_CONFIG[status].color + " text-white"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {STATUS_CONFIG[status].label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold">Contact Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{influencer.full_name}</span>
                  </div>
                  {influencer.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${influencer.email}`}
                        className="text-primary hover:underline"
                      >
                        {influencer.email}
                      </a>
                    </div>
                  )}
                  {influencer.contact_person && (
                    <div className="flex items-center gap-3">
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Assigned to {influencer.contact_person}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{formattedFollowers} followers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{influencer.engagement_rate.toFixed(1)}% engagement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">
                      ~{formattedReach} reach
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category & Promo Code */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold">Category</h3>
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  {CATEGORY_LABELS[influencer.category]}
                </span>
              </div>

              {influencer.promo_code && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Promo Code</h3>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
                      {influencer.promo_code}
                    </code>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {influencer.notes && (
              <div className="space-y-3">
                <h3 className="font-semibold">Notes</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {influencer.notes}
                </p>
              </div>
            )}

            {/* Dates */}
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Added: {formatDate(influencer.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-muted p-4 flex justify-between">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditForm(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      <InfluencerForm
        influencer={influencer}
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
      />
    </>
  );
}
