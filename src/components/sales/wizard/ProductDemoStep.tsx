import { useState } from "react";
import { Play, Presentation } from "lucide-react";
import { EcosystemPresentation } from "./EcosystemPresentation";

export function ProductDemoStep() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Product Demo</h2>
          <p className="mt-1 text-muted-foreground">
            Präsentiere das Prometheus Ecosystem dem Interessenten
          </p>
        </div>

        {/* Launch Card */}
        <button
          type="button"
          onClick={() => setShowDemo(true)}
          className="group w-full rounded-2xl border border-muted/30 bg-gradient-to-br from-primary/5 to-orange-600/5 p-8 text-left transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-600 shadow-lg shadow-primary/20">
              <Presentation className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                Prometheus Ecosystem Präsentation
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                8 interaktive Slides — navigiere mit Pfeiltasten oder klicke
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Play className="h-5 w-5 text-primary ml-0.5" />
            </div>
          </div>
        </button>

        {/* Key Topics Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "VBT Technologie",
            "Coach Dashboard",
            "Enterprise Features",
            "Partner Programm",
          ].map((topic) => (
            <div
              key={topic}
              className="p-3 rounded-xl bg-card/30 border border-muted/20 text-center text-sm"
            >
              {topic}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Presentation */}
      {showDemo && <EcosystemPresentation onClose={() => setShowDemo(false)} />}
    </>
  );
}
