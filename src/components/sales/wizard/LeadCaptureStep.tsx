import { Input } from "@/components/ui/input";
import type { PainPoint } from "@/api/types/sales";
import { calculatePricing } from "@/api/types/sales";

interface LeadFormData {
  gymName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
}

interface LeadCaptureStepProps {
  formData: LeadFormData;
  onFormChange: (data: Partial<LeadFormData>) => void;
  coachesCount: number;
  clientsCount: number;
  isFoundingPartner: boolean;
  selectedPainPoints: PainPoint[];
}

export function LeadCaptureStep({
  formData,
  onFormChange,
  coachesCount,
  clientsCount,
  isFoundingPartner,
  selectedPainPoints,
}: LeadCaptureStepProps) {
  const pricing = calculatePricing(coachesCount, clientsCount, isFoundingPartner);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Capture Contact Details</h2>
        <p className="mt-2 text-muted-foreground">
          Save the lead data for follow-up
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-xl bg-primary/10 p-6">
        <h3 className="mb-4 text-lg font-semibold text-primary">
          Summary
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Team Size</p>
            <p className="font-semibold">
              {coachesCount} Coach{coachesCount > 1 ? "es" : ""}, {clientsCount}{" "}
              Clients
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-semibold">
              CHF {pricing.monthly.toFixed(0)}/month
              {isFoundingPartner && (
                <span className="ml-2 text-xs text-green-400">
                  (Founding Partner)
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pain Points</p>
            <p className="font-semibold">{selectedPainPoints.length} selected</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Gym/Studio Name *
            </label>
            <Input
              placeholder="e.g. FitHub Zurich"
              value={formData.gymName}
              onChange={(e) => onFormChange({ gymName: e.target.value })}
              className="bg-card"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Contact Person *
            </label>
            <Input
              placeholder="e.g. John Smith"
              value={formData.contactName}
              onChange={(e) => onFormChange({ contactName: e.target.value })}
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
              value={formData.contactEmail}
              onChange={(e) => onFormChange({ contactEmail: e.target.value })}
              className="bg-card"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Phone (optional)
            </label>
            <Input
              type="tel"
              placeholder="+41 79 123 45 67"
              value={formData.contactPhone}
              onChange={(e) => onFormChange({ contactPhone: e.target.value })}
              className="bg-card"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Notes / Special Requirements
          </label>
          <textarea
            placeholder="e.g. Interested in integration with existing booking system..."
            value={formData.notes}
            onChange={(e) => onFormChange({ notes: e.target.value })}
            rows={4}
            className="w-full rounded-xl border border-muted bg-card p-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-xl bg-card p-6">
        <h3 className="mb-3 font-semibold">Next Steps</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-primary">1.</span>
            <span>Lead will be saved in the pipeline as "New"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-primary">2.</span>
            <span>Follow-up email/call within 24 hours</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-primary">3.</span>
            <span>Schedule demo appointment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-primary">4.</span>
            <span>Onboarding & Setup</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
