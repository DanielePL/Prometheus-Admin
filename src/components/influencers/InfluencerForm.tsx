import { useState } from "react";
import { X, Instagram, User, Mail, Users, TrendingUp, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateInfluencer, useUpdateInfluencer } from "@/hooks/useInfluencers";
import {
  INFLUENCER_CATEGORIES,
  CATEGORY_LABELS,
  TEAM_MEMBERS,
  type Influencer,
  type CreateInfluencerInput,
} from "@/api/types/influencers";
import { cn } from "@/lib/utils";

interface InfluencerFormProps {
  influencer?: Influencer;
  isOpen: boolean;
  onClose: () => void;
}

export function InfluencerForm({ influencer, isOpen, onClose }: InfluencerFormProps) {
  const isEdit = !!influencer;
  const createInfluencer = useCreateInfluencer();
  const updateInfluencer = useUpdateInfluencer();

  const [formData, setFormData] = useState<CreateInfluencerInput>({
    instagram_handle: influencer?.instagram_handle || "",
    full_name: influencer?.full_name || "",
    email: influencer?.email || "",
    follower_count: influencer?.follower_count || 0,
    engagement_rate: influencer?.engagement_rate || 0,
    category: influencer?.category || "fitness",
    contact_person: influencer?.contact_person || undefined,
    notes: influencer?.notes || "",
    promo_code: influencer?.promo_code || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && influencer) {
      updateInfluencer.mutate(
        { id: influencer.id, data: formData },
        { onSuccess: () => onClose() }
      );
    } else {
      createInfluencer.mutate(formData, { onSuccess: () => onClose() });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-muted p-6">
          <h2 className="text-xl font-bold">
            {isEdit ? "Edit Influencer" : "Add Influencer"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-4">
          {/* Instagram Handle */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram Handle</label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="@username"
                value={formData.instagram_handle}
                onChange={(e) =>
                  setFormData({ ...formData, instagram_handle: e.target.value })
                }
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email (optional)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="john@example.com"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Followers & Engagement */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Followers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="10000"
                  value={formData.follower_count || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, follower_count: Number(e.target.value) })
                  }
                  className="pl-10"
                  required
                  min={0}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Engagement Rate (%)</label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="3.5"
                  value={formData.engagement_rate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, engagement_rate: Number(e.target.value) })
                  }
                  className="pl-10"
                  required
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <div className="flex flex-wrap gap-2">
              {INFLUENCER_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm transition-colors",
                    formData.category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Assigned To</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, contact_person: undefined })}
                className={cn(
                  "rounded-full px-3 py-1 text-sm transition-colors",
                  !formData.contact_person
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                Unassigned
              </button>
              {TEAM_MEMBERS.map((member) => (
                <button
                  key={member}
                  type="button"
                  onClick={() => setFormData({ ...formData, contact_person: member })}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm transition-colors",
                    formData.contact_person === member
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {member}
                </button>
              ))}
            </div>
          </div>

          {/* Promo Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Promo Code (optional)</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="PROMO20"
                value={formData.promo_code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              placeholder="Additional information..."
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createInfluencer.isPending || updateInfluencer.isPending}
            >
              {isEdit ? "Update" : "Add Influencer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
