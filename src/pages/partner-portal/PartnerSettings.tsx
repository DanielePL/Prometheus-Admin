import { useState } from "react";
import { User, Mail, Link, CreditCard, Building, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePartnerProfile, useUpdatePayoutDetails } from "@/hooks/usePartnerPortal";
import { cn } from "@/lib/utils";

export default function PartnerSettings() {
  const { data: profile, isLoading } = usePartnerProfile();
  const updatePayoutDetails = useUpdatePayoutDetails();

  const [payoutMethod, setPayoutMethod] = useState<"revolut" | "bank_transfer">(
    profile?.payout_method || "revolut"
  );
  const [revolutEmail, setRevolutEmail] = useState(
    profile?.payout_details?.revolut_email || ""
  );
  const [iban, setIban] = useState(profile?.payout_details?.iban || "");
  const [bic, setBic] = useState(profile?.payout_details?.bic || "");
  const [saved, setSaved] = useState(false);

  const handleSavePayoutDetails = () => {
    updatePayoutDetails.mutate(
      {
        payout_method: payoutMethod,
        revolut_email: payoutMethod === "revolut" ? revolutEmail : undefined,
        iban: payoutMethod === "bank_transfer" ? iban : undefined,
        bic: payoutMethod === "bank_transfer" ? bic : undefined,
      },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-card animate-pulse rounded" />
        <div className="h-64 bg-card animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Profile Info */}
      <div className="rounded-xl bg-card p-6">
        <h3 className="font-semibold mb-4">Profile Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Name</label>
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.name}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.email}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Referral Code</label>
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-3">
              <Link className="h-4 w-4 text-muted-foreground" />
              <code className="font-mono">{profile?.referral_code}</code>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Commission Rate</label>
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-3">
              <span className="text-primary font-semibold">
                {profile?.commission_percent}%
              </span>
              <span className="text-muted-foreground">per referral</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="rounded-xl bg-card p-6">
        <h3 className="font-semibold mb-4">Payment Settings</h3>

        {/* Method Selection */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <button
            onClick={() => setPayoutMethod("revolut")}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 p-4 transition-colors text-left",
              payoutMethod === "revolut"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                payoutMethod === "revolut" ? "bg-primary" : "bg-muted"
              )}
            >
              <CreditCard
                className={cn(
                  "h-5 w-5",
                  payoutMethod === "revolut" ? "text-white" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <p className="font-medium">Revolut</p>
              <p className="text-xs text-muted-foreground">Instant transfer</p>
            </div>
          </button>

          <button
            onClick={() => setPayoutMethod("bank_transfer")}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 p-4 transition-colors text-left",
              payoutMethod === "bank_transfer"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                payoutMethod === "bank_transfer" ? "bg-primary" : "bg-muted"
              )}
            >
              <Building
                className={cn(
                  "h-5 w-5",
                  payoutMethod === "bank_transfer" ? "text-white" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <p className="font-medium">Bank Transfer</p>
              <p className="text-xs text-muted-foreground">1-3 business days</p>
            </div>
          </button>
        </div>

        {/* Method Details */}
        {payoutMethod === "revolut" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Revolut Email / Tag</label>
              <Input
                placeholder="@yourtag or email@example.com"
                value={revolutEmail}
                onChange={(e) => setRevolutEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">IBAN</label>
              <Input
                placeholder="CH93 0076 2011 6238 5295 7"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">BIC/SWIFT</label>
              <Input
                placeholder="UBSWCHZH80A"
                value={bic}
                onChange={(e) => setBic(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-6">
          <Button
            onClick={handleSavePayoutDetails}
            disabled={updatePayoutDetails.isPending}
          >
            {updatePayoutDetails.isPending ? "Saving..." : "Save Changes"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-500">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
