import { cn } from "@/lib/utils";
import { calculatePricing, PRICING } from "@/api/types/sales";
import { Sparkles, Users, Building2 } from "lucide-react";

interface PricingStepProps {
  coachesCount: number;
  clientsCount: number;
  isFoundingPartner: boolean;
  onCoachesChange: (count: number) => void;
  onClientsChange: (count: number) => void;
  onFoundingPartnerChange: (value: boolean) => void;
}

export function PricingStep({
  coachesCount,
  clientsCount,
  isFoundingPartner,
  onCoachesChange,
  onClientsChange,
  onFoundingPartnerChange,
}: PricingStepProps) {
  const pricing = calculatePricing(coachesCount, clientsCount, isFoundingPartner);
  const regularPricing = calculatePricing(coachesCount, clientsCount, false);
  const savings = regularPricing.monthly - pricing.monthly;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Interactive Price Calculator</h2>
        <p className="mt-2 text-muted-foreground">
          Adjust the numbers and see the price live
        </p>
      </div>

      {/* Sliders */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Coaches Slider */}
        <div className="rounded-xl bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Coaches</h3>
              <p className="text-sm text-muted-foreground">
                CHF {PRICING.COACH_RATE}/Coach/Monat
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="50"
              value={coachesCount}
              onChange={(e) => onCoachesChange(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">1</span>
              <span className="text-2xl font-bold">{coachesCount}</span>
              <span className="text-sm text-muted-foreground">50</span>
            </div>
          </div>
        </div>

        {/* Clients Slider */}
        <div className="rounded-xl bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Clients</h3>
              <p className="text-sm text-muted-foreground">
                CHF {PRICING.CLIENT_RATE}/Client/Monat
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={clientsCount}
              onChange={(e) => onClientsChange(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">10</span>
              <span className="text-2xl font-bold">{clientsCount}</span>
              <span className="text-sm text-muted-foreground">500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Founding Partner Toggle */}
      <div
        onClick={() => onFoundingPartnerChange(!isFoundingPartner)}
        className={cn(
          "cursor-pointer rounded-xl border-2 p-6 transition-all",
          isFoundingPartner
            ? "border-primary bg-primary/10 glow-orange"
            : "border-muted bg-card hover:border-primary/50"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                isFoundingPartner ? "bg-primary" : "bg-muted"
              )}
            >
              <Sparkles
                className={cn(
                  "h-6 w-6",
                  isFoundingPartner
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <h3 className="font-semibold">Founding Partner</h3>
              <p className="text-sm text-muted-foreground">
                50% discount for early partners
              </p>
            </div>
          </div>
          <div
            className={cn(
              "flex h-8 w-14 items-center rounded-full p-1 transition-colors",
              isFoundingPartner ? "bg-primary" : "bg-muted"
            )}
          >
            <div
              className={cn(
                "h-6 w-6 rounded-full bg-white shadow transition-transform",
                isFoundingPartner && "translate-x-6"
              )}
            />
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">Monthly Cost</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            {isFoundingPartner && (
              <span className="text-xl text-muted-foreground line-through">
                CHF {regularPricing.monthly.toFixed(0)}
              </span>
            )}
            <span className="text-4xl font-bold text-primary">
              CHF {pricing.monthly.toFixed(0)}
            </span>
          </div>
          {isFoundingPartner && (
            <p className="mt-2 text-sm text-green-400">
              You save CHF {savings.toFixed(0)}/month
            </p>
          )}
        </div>

        <div className="rounded-xl bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Yearly (15% discount)
          </p>
          <span className="mt-2 block text-4xl font-bold">
            CHF {pricing.yearly.toFixed(0)}
          </span>
          <p className="mt-2 text-sm text-muted-foreground">
            = CHF {(pricing.yearly / 12).toFixed(0)}/month
          </p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="rounded-xl bg-muted/30 p-4">
        <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
          Cost Breakdown:
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Enterprise Dashboard</span>
            <span>CHF {PRICING.GYM_BASE}</span>
          </div>
          <div className="flex justify-between">
            <span>
              {coachesCount} Coach{coachesCount > 1 ? "es" : ""} × CHF{" "}
              {PRICING.COACH_RATE}
            </span>
            <span>CHF {coachesCount * PRICING.COACH_RATE}</span>
          </div>
          <div className="flex justify-between">
            <span>
              {clientsCount} Clients × CHF {PRICING.CLIENT_RATE}
            </span>
            <span>CHF {clientsCount * PRICING.CLIENT_RATE}</span>
          </div>
          {isFoundingPartner && (
            <div className="flex justify-between text-green-400">
              <span>Founding Partner Discount (50%)</span>
              <span>-CHF {savings.toFixed(0)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-muted pt-2 font-bold">
            <span>Total</span>
            <span>CHF {pricing.monthly.toFixed(0)}/month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
