import { DemoWizard } from "@/components/sales/wizard/DemoWizard";

export function SalesDemoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Demo</h1>
        <p className="mt-1 text-muted-foreground">
          Interactive demo wizard for sales conversations
        </p>
      </div>

      <DemoWizard />
    </div>
  );
}
