import { useState } from "react";
import { Download, ExternalLink, ZoomIn, ZoomOut, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContractViewerProps {
  pdfUrl?: string;
  title?: string;
  className?: string;
  showDownload?: boolean;
  height?: string;
}

export function ContractViewer({
  pdfUrl,
  title = "Contract",
  className,
  showDownload = true,
  height = "600px",
}: ContractViewerProps) {
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank");
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  if (!pdfUrl) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-muted/20 to-muted/5",
          className
        )}
        style={{ height }}
      >
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Flame className="w-10 h-10 text-primary/40" />
        </div>
        <p className="text-muted-foreground text-lg font-medium">No contract uploaded</p>
        <p className="text-muted-foreground/70 text-sm mt-1">
          Upload a PDF to view the Prometheus Creator Agreement
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col rounded-xl overflow-hidden border border-primary/10 bg-card", className)}>
      {/* Header / Toolbar - Prometheus Branded */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="h-8 w-8 rounded"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="h-8 w-8 rounded"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {showDownload && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="h-8 w-8 rounded"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="rounded-lg"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div
        className="overflow-auto bg-muted/20"
        style={{ height }}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top left",
            width: `${100 / (zoom / 100)}%`,
          }}
        >
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full border-0"
            style={{ height: `calc(${height} * ${100 / zoom})` }}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}

// Simpler inline viewer for previews - Prometheus Branded
export function ContractPreview({
  pdfUrl,
  className,
}: {
  pdfUrl?: string;
  className?: string;
}) {
  if (!pdfUrl) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-primary/20 bg-gradient-to-br from-muted/20 to-muted/5",
          className
        )}
      >
        <Flame className="w-8 h-8 text-primary/30 mb-1" />
        <span className="text-xs text-muted-foreground">No Contract</span>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg overflow-hidden border border-primary/10 relative", className)}>
      {/* Small branded badge */}
      <div className="absolute top-1 right-1 z-10 bg-gradient-to-r from-primary to-orange-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
        PDF
      </div>
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        className="w-full h-32 border-0"
        title="Contract Preview"
      />
    </div>
  );
}
