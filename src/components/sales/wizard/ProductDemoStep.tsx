import { ExternalLink, Monitor } from "lucide-react";

const DEMO_URL = "https://danielepl.github.io/PrometheusPartnershipDemo/enterprise/";

export function ProductDemoStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Demo</h2>
          <p className="mt-1 text-muted-foreground">
            Walk through the Prometheus Enterprise platform
          </p>
        </div>
        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Open fullscreen
        </a>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-muted/30 bg-black">
        {/* Toolbar */}
        <div className="flex items-center gap-2 bg-muted/10 px-4 py-2 border-b border-muted/20">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Use arrow keys or swipe to navigate slides
          </span>
        </div>

        {/* iframe */}
        <iframe
          src={DEMO_URL}
          title="Prometheus Enterprise Demo"
          className="w-full border-0"
          style={{ height: "520px" }}
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
