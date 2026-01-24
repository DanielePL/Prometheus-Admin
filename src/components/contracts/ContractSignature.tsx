import { useRef, useState, useEffect } from "react";
import { Check, RotateCcw, Flame, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContractSignatureProps {
  onSignatureComplete: (signatureData: string) => void;
  onCancel?: () => void;
  className?: string;
  disabled?: boolean;
  creatorName?: string;
}

export function ContractSignature({
  onSignatureComplete,
  onCancel,
  className,
  disabled = false,
  creatorName,
}: ContractSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas with higher resolution for better quality
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Set drawing styles - Prometheus orange for signature
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    setLastPoint(coords);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !lastPoint) return;

    const coords = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setLastPoint(coords);
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
  };

  const handleComplete = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    // Get signature as base64 PNG
    const signatureData = canvas.toDataURL("image/png");
    onSignatureComplete(signatureData);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Prometheus Branding Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-primary/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 shadow-lg shadow-primary/25">
          <Flame className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Prometheus Creator Agreement</h3>
          <p className="text-sm text-muted-foreground">Digital Signature</p>
        </div>
      </div>

      {/* Creator Info */}
      {creatorName && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
          <p className="text-sm text-muted-foreground">Signing as:</p>
          <p className="font-semibold">{creatorName}</p>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Please draw your signature in the box below using your mouse or finger
      </div>

      <div
        className={cn(
          "relative rounded-xl border-2 overflow-hidden bg-white shadow-inner",
          disabled ? "opacity-50 cursor-not-allowed border-muted" : "border-muted-foreground/20",
          hasSignature && "border-primary/50 shadow-primary/10"
        )}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-48 touch-none cursor-crosshair"
          style={{ display: "block" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Signature line with X mark */}
        <div className="absolute bottom-10 left-8 right-8 flex items-end gap-2">
          <span className="text-muted-foreground/50 text-lg font-serif">X</span>
          <div className="flex-1 border-b border-muted-foreground/30" />
        </div>
        <div className="absolute bottom-3 left-8 text-xs text-muted-foreground">
          Authorized Signature
        </div>
        <div className="absolute bottom-3 right-8 text-xs text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Terms Agreement Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="sr-only"
            disabled={disabled}
          />
          <div
            className={cn(
              "w-5 h-5 rounded border-2 transition-all flex items-center justify-center",
              agreedToTerms
                ? "bg-primary border-primary"
                : "border-muted-foreground/30 group-hover:border-primary/50"
            )}
          >
            {agreedToTerms && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          I confirm that I have read and agree to the{" "}
          <span className="text-primary font-medium">Prometheus Creator Agreement</span> terms and conditions.
          I understand that this digital signature is legally binding.
        </span>
      </label>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
        <Shield className="w-4 h-4 text-green-500 shrink-0" />
        <span>Your signature is secured and encrypted. This document will be timestamped and stored securely.</span>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSignature}
            disabled={!hasSignature || disabled}
            className="rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear
          </Button>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={disabled}
              className="rounded-xl"
            >
              Cancel
            </Button>
          )}
        </div>

        <Button
          onClick={handleComplete}
          disabled={!hasSignature || !agreedToTerms || disabled}
          className="rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-lg shadow-primary/25"
        >
          <Check className="w-4 h-4 mr-1" />
          Sign & Submit
        </Button>
      </div>
    </div>
  );
}
