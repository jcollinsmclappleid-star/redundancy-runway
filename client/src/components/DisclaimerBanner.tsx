import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-muted border-b px-4 py-2" data-testid="disclaimer-banner">
      <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-muted-foreground">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span>
          This tool provides illustrative financial projections based on assumptions you enter. It does not provide financial, employment, debt, or benefits advice. All projections are estimates.
        </span>
      </div>
    </div>
  );
}
