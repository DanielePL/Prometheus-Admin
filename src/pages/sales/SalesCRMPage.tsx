import { useState } from "react";
import { Plus, Filter, Search, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PipelineView } from "@/components/sales/crm/PipelineView";
import { useCreateLead } from "@/hooks/useSales";
import { calculatePricing, PAIN_POINT_LABELS, type PainPoint } from "@/api/types/sales";
import { cn } from "@/lib/utils";

const ALL_PAIN_POINTS = Object.keys(PAIN_POINT_LABELS) as PainPoint[];

export function SalesCRMPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewLead, setShowNewLead] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="mt-1 text-muted-foreground">
            Manage leads and track the sales process
          </p>
        </div>
        <Button onClick={() => setShowNewLead(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Pipeline */}
      <PipelineView searchQuery={searchQuery} />

      {/* New Lead Modal */}
      {showNewLead && <NewLeadModal onClose={() => setShowNewLead(false)} />}
    </div>
  );
}

// ---- New Lead Modal ----

function NewLeadModal({ onClose }: { onClose: () => void }) {
  const createLead = useCreateLead();

  const [gymName, setGymName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [coachesCount, setCoachesCount] = useState(1);
  const [clientsCount, setClientsCount] = useState(10);
  const [foundingPartner, setFoundingPartner] = useState(false);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [notes, setNotes] = useState("");

  const pricing = calculatePricing(coachesCount, clientsCount, foundingPartner);
  const canSubmit = gymName.trim() && contactName.trim() && contactEmail.trim();

  const togglePainPoint = (pp: PainPoint) => {
    setPainPoints((prev) =>
      prev.includes(pp) ? prev.filter((p) => p !== pp) : [...prev, pp]
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await createLead.mutateAsync({
        gym_name: gymName.trim(),
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || undefined,
        coaches_count: coachesCount,
        clients_count: clientsCount,
        pain_points: painPoints,
        pricing_quoted: pricing.monthly,
        founding_partner: foundingPartner,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create lead:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-muted p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">New Lead</h2>
              <p className="text-sm text-muted-foreground">Add a gym to the pipeline</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)] p-6 space-y-5">
          {/* Gym + Contact */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Gym Name *</label>
              <Input
                placeholder="e.g. FitHub Zurich"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="bg-card"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Contact Person *</label>
              <Input
                placeholder="e.g. John Smith"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="bg-card"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Email *</label>
              <Input
                type="email"
                placeholder="john@fithub.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="bg-card"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <Input
                type="tel"
                placeholder="+41 79 123 45 67"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="bg-card"
              />
            </div>
          </div>

          {/* Team Size */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Coaches</label>
              <Input
                type="number"
                min={1}
                value={coachesCount}
                onChange={(e) => setCoachesCount(Math.max(1, Number(e.target.value)))}
                className="bg-card"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Clients</label>
              <Input
                type="number"
                min={0}
                value={clientsCount}
                onChange={(e) => setClientsCount(Math.max(0, Number(e.target.value)))}
                className="bg-card"
              />
            </div>
          </div>

          {/* Founding Partner */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={foundingPartner}
              onChange={(e) => setFoundingPartner(e.target.checked)}
              className="h-4 w-4 rounded border-muted accent-primary"
            />
            <span className="text-sm font-medium">Founding Partner (50% discount)</span>
            <span className="ml-auto text-sm font-semibold text-primary">
              CHF {pricing.monthly.toFixed(0)}/mo
            </span>
          </label>

          {/* Pain Points */}
          <div>
            <label className="mb-2 block text-sm font-medium">Pain Points</label>
            <div className="flex flex-wrap gap-2">
              {ALL_PAIN_POINTS.map((pp) => (
                <button
                  key={pp}
                  type="button"
                  onClick={() => togglePainPoint(pp)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    painPoints.includes(pp)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {PAIN_POINT_LABELS[pp]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-medium">Notes</label>
            <textarea
              placeholder="Additional context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-muted bg-card p-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-muted p-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || createLead.isPending}
          >
            {createLead.isPending ? "Creating..." : "Create Lead"}
          </Button>
        </div>
      </div>
    </div>
  );
}
