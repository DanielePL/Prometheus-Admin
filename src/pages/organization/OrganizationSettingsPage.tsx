import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Save,
  AlertCircle,
  Sparkles,
  Users,
  CreditCard,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { PLAN_LIMITS, type SubscriptionPlan } from "@/api/types/permissions";

export function OrganizationSettingsPage() {
  const { organization, isOwner } = useAuth();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setSlug(organization.slug);
    }
  }, [organization]);

  const handleSave = async () => {
    if (!organization || !supabase) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("organizations")
        .update({ name, slug })
        .eq("id", organization.id);

      if (error) {
        if (error.message.includes("duplicate")) {
          toast.error("This URL is already taken. Please choose another.");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Organization settings saved");
    } catch (error) {
      console.error("Error saving organization:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (!organization) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Organization not found</p>
        </div>
      </div>
    );
  }

  const planLimits = PLAN_LIMITS[organization.subscription_plan as SubscriptionPlan];
  const isTrialing = organization.subscription_status === "trialing";
  const trialEndsAt = organization.trial_ends_at
    ? new Date(organization.trial_ends_at)
    : null;
  const daysRemaining = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Organization Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization's settings and billing
        </p>
      </div>

      {/* Trial Banner */}
      {isTrialing && (
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Free Trial - {daysRemaining} days remaining</p>
              <p className="text-sm text-muted-foreground">
                You have full access to all features.{" "}
                <button className="text-primary hover:underline">
                  Upgrade now
                </button>{" "}
                to continue after your trial ends.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-semibold mb-4">General</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Organization"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Workspace URL</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  app.launchpad.com/
                </span>
                <Input
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                  }
                  placeholder="my-org"
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Current Plan */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-semibold mb-4">Current Plan</h2>

          <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/30 mb-4">
            <div>
              <p className="font-semibold text-lg capitalize">
                {organization.subscription_plan} Plan
              </p>
              <p className="text-sm text-muted-foreground">
                {isTrialing ? "Free trial" : "Active subscription"}
              </p>
            </div>
            <Button variant="outline">Manage Billing</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-background/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Team Seats</span>
              </div>
              <p className="text-2xl font-bold">
                {planLimits.maxSeats === -1 ? "Unlimited" : planLimits.maxSeats}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-background/30">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Max Creators</span>
              </div>
              <p className="text-2xl font-bold">
                {planLimits.maxCreators === -1 ? "Unlimited" : planLimits.maxCreators}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Included Features</p>
            <div className="grid grid-cols-2 gap-2">
              {planLimits.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        {isOwner && (
          <div className="glass rounded-xl p-6 border-destructive/30">
            <h2 className="font-semibold mb-4 text-destructive">Danger Zone</h2>

            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="font-medium">Delete Organization</p>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete this organization and all its data. This action
                cannot be undone.
              </p>
              <Button variant="destructive" size="sm">
                Delete Organization
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
