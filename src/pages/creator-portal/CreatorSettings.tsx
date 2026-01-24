import { useState } from "react";
import { User, Mail, Link, CreditCard, Building, Check, FileText, Clock, Flame, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePartnerProfile, useUpdatePayoutDetails } from "@/hooks/usePartnerPortal";
import { useCreatorContracts, useSignContract } from "@/hooks/useContracts";
import { ContractViewer } from "@/components/contracts/ContractViewer";
import { ContractSignature } from "@/components/contracts/ContractSignature";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export default function PartnerSettings() {
  const { data: profile, isLoading } = usePartnerProfile();
  const updatePayoutDetails = useUpdatePayoutDetails();
  const { data: contracts } = useCreatorContracts(profile?.id || "");
  const signContractMutation = useSignContract();

  const [payoutMethod, setPayoutMethod] = useState<"revolut" | "bank_transfer">(
    profile?.payout_method || "revolut"
  );
  const [revolutEmail, setRevolutEmail] = useState(
    profile?.payout_details?.revolut_email || ""
  );
  const [iban, setIban] = useState(profile?.payout_details?.iban || "");
  const [bic, setBic] = useState(profile?.payout_details?.bic || "");
  const [saved, setSaved] = useState(false);
  const [showContractViewer, setShowContractViewer] = useState(false);
  const [showSignaturePanel, setShowSignaturePanel] = useState(false);

  const pendingContract = contracts?.find((c) => c.status === "pending_signature");
  const signedContract = contracts?.find((c) => c.status === "signed");
  const latestContract = pendingContract || signedContract || contracts?.[0];

  const handleSignContract = async (signatureData: string) => {
    if (!pendingContract) return;
    try {
      await signContractMutation.mutateAsync({
        contract_id: pendingContract.id,
        signature_data: signatureData,
      });
      setShowSignaturePanel(false);
    } catch (error) {
      console.error("Failed to sign contract:", error);
    }
  };

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

      {/* Contract Section - Prometheus Branded */}
      <div className="rounded-xl bg-gradient-to-br from-card to-card/80 border border-primary/10 overflow-hidden">
        {/* Branded Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/25">
                <Flame className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Prometheus Creator Agreement</h3>
                <p className="text-sm text-muted-foreground">
                  {signedContract
                    ? `Signed on ${format(parseISO(signedContract.signed_at!), "MMMM d, yyyy")}`
                    : pendingContract
                    ? "Awaiting your signature"
                    : "No contract available"}
                </p>
              </div>
            </div>

            {signedContract && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-500 font-medium">
                <Shield className="w-5 h-5" />
                <span>Signed & Verified</span>
              </div>
            )}
            {pendingContract && !signedContract && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-500 font-medium animate-pulse">
                <Clock className="w-5 h-5" />
                <span>Action Required</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {latestContract?.pdf_url ? (
            <div className="space-y-4">
              {/* Contract Preview with Branded Frame */}
              <div
                className="relative rounded-xl border-2 border-primary/20 overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all group"
                onClick={() => setShowContractViewer(true)}
              >
                {/* Branded corner ribbon */}
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-gradient-to-r from-primary to-orange-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg shadow-lg">
                    Official Document
                  </div>
                </div>

                <iframe
                  src={`${latestContract.signed_pdf_url || latestContract.pdf_url}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-48 border-0 pointer-events-none"
                  title="Contract Preview"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                    <span className="text-sm font-medium">Click to view full document</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowContractViewer(true)}
                  className="rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Contract
                </Button>

                {signedContract && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(signedContract.signed_pdf_url || signedContract.pdf_url, "_blank")}
                    className="rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Signed Copy
                  </Button>
                )}

                {pendingContract && !signedContract && (
                  <Button
                    onClick={() => setShowSignaturePanel(true)}
                    className="rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-lg shadow-primary/25"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Sign Contract Now
                  </Button>
                )}
              </div>

              {/* Signature Panel */}
              {showSignaturePanel && pendingContract && (
                <div className="mt-6 p-6 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-muted/50 to-muted/20">
                  <ContractSignature
                    onSignatureComplete={handleSignContract}
                    onCancel={() => setShowSignaturePanel(false)}
                    disabled={signContractMutation.isPending}
                    creatorName={profile?.name}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h4 className="font-semibold text-lg mb-2">No Contract Available</h4>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Your Prometheus Creator Agreement hasn't been assigned yet.
                Contact your partner manager if you believe this is an error.
              </p>
              <a
                href="mailto:creators@prometheus.app"
                className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Full Contract Viewer Modal - Prometheus Branded */}
      {showContractViewer && latestContract && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-primary/10">
            {/* Branded Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/25">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Prometheus Creator Agreement</h3>
                  <p className="text-xs text-muted-foreground">
                    {signedContract ? "Signed Document" : "Review Document"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {signedContract && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(signedContract.signed_pdf_url || signedContract.pdf_url, "_blank")}
                    className="rounded-lg border-primary/20"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContractViewer(false)}
                  className="rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-4">
              <ContractViewer
                pdfUrl={latestContract.signed_pdf_url || latestContract.pdf_url}
                title="Prometheus Creator Agreement"
                height="70vh"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
