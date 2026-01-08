import { Building2, Users, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PainPoint } from "@/api/types/sales";
import { PRICING } from "@/api/types/sales";

// Map pain points to features
const PAIN_POINT_SOLUTIONS: Record<PainPoint, string[]> = {
  time_waste: ["Automatic Training Planning", "AI-powered Nutrition Analysis"],
  no_overview: ["Dashboard with All Clients", "Progress Tracking"],
  nutrition_chaos: ["Meal Photo Scanning", "Automatic Macro Calculation"],
  scaling: ["Unlimited Clients per Coach", "Template System"],
  no_vbt: ["VBT Video Analysis", "Real-time Velocity Tracking"],
  retention: ["Automatic Check-ins", "Engagement Analytics"],
  burnout: ["Smart Workload Distribution", "Automated Communication"],
  data_silos: ["Central Dashboard", "API Integrations"],
};

interface TierCardProps {
  title: string;
  price: string;
  priceNote: string;
  icon: React.ElementType;
  features: string[];
  color: string;
  highlighted?: boolean;
}

function TierCard({
  title,
  price,
  priceNote,
  icon: Icon,
  features,
  color,
  highlighted,
}: TierCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border-2 p-6 transition-all",
        highlighted
          ? "border-primary bg-primary/10 glow-orange scale-105"
          : "border-muted bg-card hover:border-primary/50"
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Core Product
        </div>
      )}
      <div
        className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center rounded-xl",
          color
        )}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-muted-foreground"> {priceNote}</span>
      </div>
      <ul className="mt-4 flex-1 space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-1 text-primary">✓</span>
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SolutionStepProps {
  selectedPainPoints: PainPoint[];
}

export function SolutionStep({ selectedPainPoints }: SolutionStepProps) {
  // Gather relevant solutions based on selected pain points
  const relevantSolutions = new Set<string>();
  selectedPainPoints.forEach((pp) => {
    PAIN_POINT_SOLUTIONS[pp]?.forEach((s) => relevantSolutions.add(s));
  });
  const solutionList = Array.from(relevantSolutions);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">The Prometheus Solution</h2>
        <p className="mt-2 text-muted-foreground">
          An integrated system on 3 tiers
        </p>
      </div>

      {/* 3-Tier Visualization */}
      <div className="grid gap-6 md:grid-cols-3">
        <TierCard
          title="Enterprise Dashboard"
          price={`CHF ${PRICING.GYM_BASE}`}
          priceNote="/month"
          icon={Building2}
          color="bg-blue-600"
          features={[
            "Gym-wide Analytics",
            "Team Management",
            "Billing Overview",
            "Performance Reports",
            "Multi-Location Support",
          ]}
        />

        <TierCard
          title="Coach App"
          price={`CHF ${PRICING.COACH_RATE}`}
          priceNote="/coach/month"
          icon={Users}
          color="bg-primary"
          highlighted
          features={[
            "Client Dashboard",
            "Training Planning",
            "Nutrition Tracking",
            "VBT Video Analysis",
            "AI Coach Assistant",
            ...(solutionList.length > 0 ? solutionList.slice(0, 2) : []),
          ]}
        />

        <TierCard
          title="Client App"
          price={`CHF ${PRICING.CLIENT_RATE}`}
          priceNote="/client/month"
          icon={Smartphone}
          color="bg-green-600"
          features={[
            "Workout Logging",
            "Meal Photo Scanning",
            "Progress Photos",
            "Coach Communication",
            "Progress Tracking",
          ]}
        />
      </div>

      {/* Pain Point Solutions */}
      {solutionList.length > 0 && (
        <div className="rounded-xl bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Solutions for your challenges:
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {solutionList.map((solution, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-primary/10 p-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </span>
                <span className="font-medium">{solution}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
