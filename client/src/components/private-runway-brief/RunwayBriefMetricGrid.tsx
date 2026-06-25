import { Card, CardContent } from "@/components/ui/card";
import { formatGBP, formatMonths } from "@/lib/engine";
import type { BriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";

export function RunwayBriefMetricGrid({ dashboard }: { dashboard: BriefDashboardData }) {
  const metrics = [
    {
      label: "Baseline runway",
      value: formatMonths(dashboard.baseline.monthsUntilDepletion),
      context: `${dashboard.baseline.stabilityBand} stability`,
    },
    {
      label: "Severe-case runway",
      value: formatMonths(dashboard.severeCaseRunway),
      context: "Zero Income scenario",
    },
    {
      label: "Starting capital",
      value: formatGBP(dashboard.baseline.startingCapital),
      context: dashboard.composition.reconciles ? "Components reconcile" : "See composition section",
    },
    {
      label: "Net monthly burn",
      value: formatGBP(dashboard.baseline.netMonthlyBurn),
      context: "After income in model",
    },
    {
      label: "Housing pressure",
      value: `${dashboard.baseline.housingPercentOfEssentials}%`,
      context: "Of essential costs",
    },
    {
      label: "Confidence",
      value: dashboard.confidence,
      context: dashboard.hasUserReportedUncertainty ? "Uncertainty noted" : "Data completeness",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3" data-testid="brief-metric-grid">
      {metrics.map((m) => (
        <Card key={m.label} className="border-gold/20 bg-white shadow-sm rounded-xl">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">{m.label}</p>
            <p className="text-xl font-bold text-primary tabular-nums">{m.value}</p>
            {m.context && (
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug line-clamp-2">{m.context}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
