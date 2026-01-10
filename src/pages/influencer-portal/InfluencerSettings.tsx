import { useState } from "react";
import { User, CreditCard, Instagram, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInfluencerProfile, useUpdateInfluencerPayoutDetails } from "@/hooks/useInfluencerPortal";
import { useInfluencerPortal } from "@/contexts/InfluencerPortalContext";

export default function InfluencerSettings() {
  const { influencer } = useInfluencerPortal();
  const { data: profile, isLoading } = useInfluencerProfile();
  const updatePayoutDetails = useUpdateInfluencerPayoutDetails();

  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "paypal">("bank_transfer");
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSavePayoutDetails = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await updatePayoutDetails.mutateAsync({
        payment_method: paymentMethod,
        bank_name: paymentMethod === "bank_transfer" ? bankName : undefined,
        iban: paymentMethod === "bank_transfer" ? iban : undefined,
        account_holder: paymentMethod === "bank_transfer" ? accountHolder : undefined,
        paypal_email: paymentMethod === "paypal" ? paypalEmail : undefined,
      });
      setSuccessMessage("Payout details updated successfully!");
    } catch {
      setErrorMessage("Failed to update payout details. Please try again.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and payout settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Profile Information</h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{profile?.name || influencer?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="font-medium">{profile?.email || influencer?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Instagram</label>
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-primary" />
                  <p className="font-medium">@{profile?.instagram_handle || influencer?.instagram_handle}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <p className="font-medium">{profile?.category || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Commission Rate</label>
                <p className="font-medium">{profile?.commission_rate || 0}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="font-medium">
                  {profile?.joined_date
                    ? new Date(profile.joined_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payout Settings */}
      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Payout Settings</h2>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 mb-6 text-green-500 text-sm">
            <Check className="h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 mb-6 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  paymentMethod === "bank_transfer"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                }`}
              >
                <p className="font-medium">Bank Transfer</p>
                <p className="text-sm text-muted-foreground">Direct to your bank</p>
              </button>
              <button
                onClick={() => setPaymentMethod("paypal")}
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  paymentMethod === "paypal"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                }`}
              >
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-muted-foreground">Via PayPal email</p>
              </button>
            </div>
          </div>

          {/* Bank Transfer Fields */}
          {paymentMethod === "bank_transfer" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Bank Name</label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g., Credit Suisse"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">IBAN</label>
                <Input
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="CH00 0000 0000 0000 0000 0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Account Holder</label>
                <Input
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Full name as on bank account"
                />
              </div>
            </div>
          )}

          {/* PayPal Fields */}
          {paymentMethod === "paypal" && (
            <div>
              <label className="text-sm font-medium mb-2 block">PayPal Email</label>
              <Input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          )}

          <Button
            onClick={handleSavePayoutDetails}
            disabled={updatePayoutDetails.isPending}
          >
            {updatePayoutDetails.isPending ? "Saving..." : "Save Payout Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
