import { cn } from "@/lib/utils";
import {
  Clock,
  LayoutDashboard,
  Utensils,
  TrendingUp,
  Zap,
  UserMinus,
  Battery,
  Database,
} from "lucide-react";
import type { PainPoint } from "@/api/types/sales";

const PAIN_POINT_CONFIG: Record<
  PainPoint,
  { label: string; description: string; icon: React.ElementType }
> = {
  time_waste: {
    label: "Time Waste",
    description: "Too much time on admin tasks",
    icon: Clock,
  },
  no_overview: {
    label: "No Overview",
    description: "Missing visibility into all clients",
    icon: LayoutDashboard,
  },
  nutrition_chaos: {
    label: "Nutrition Chaos",
    description: "No structured nutrition planning",
    icon: Utensils,
  },
  scaling: {
    label: "Scaling Issues",
    description: "Difficult to serve more clients",
    icon: TrendingUp,
  },
  no_vbt: {
    label: "No VBT",
    description: "No Velocity-Based Training data",
    icon: Zap,
  },
  retention: {
    label: "Client Retention",
    description: "Clients don't stay long",
    icon: UserMinus,
  },
  burnout: {
    label: "Coach Burnout",
    description: "Trainer overload",
    icon: Battery,
  },
  data_silos: {
    label: "Data Silos",
    description: "Data scattered across different apps",
    icon: Database,
  },
};

interface DiscoveryStepProps {
  selectedPainPoints: PainPoint[];
  onToggle: (painPoint: PainPoint) => void;
}

export function DiscoveryStep({
  selectedPainPoints,
  onToggle,
}: DiscoveryStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">What are the biggest challenges?</h2>
        <p className="mt-2 text-muted-foreground">
          Select all applicable pain points
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {(Object.entries(PAIN_POINT_CONFIG) as [PainPoint, typeof PAIN_POINT_CONFIG[PainPoint]][]).map(
          ([key, config]) => {
            const Icon = config.icon;
            const isSelected = selectedPainPoints.includes(key);

            return (
              <button
                key={key}
                onClick={() => onToggle(key)}
                className={cn(
                  "group relative flex flex-col items-center rounded-xl border-2 p-6 transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 glow-orange"
                    : "border-muted bg-card hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={cn(
                    "mt-3 text-sm font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {config.label}
                </span>
                <span className="mt-1 text-center text-xs text-muted-foreground">
                  {config.description}
                </span>
                {isSelected && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-xs">✓</span>
                  </div>
                )}
              </button>
            );
          }
        )}
      </div>

      {selectedPainPoints.length > 0 && (
        <div className="rounded-xl bg-primary/10 p-4 text-center">
          <p className="text-sm text-primary">
            <strong>{selectedPainPoints.length}</strong> Pain Point
            {selectedPainPoints.length !== 1 ? "s" : ""} selected
          </p>
        </div>
      )}
    </div>
  );
}
