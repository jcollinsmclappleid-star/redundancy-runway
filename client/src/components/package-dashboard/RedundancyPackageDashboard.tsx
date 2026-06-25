import type { RunwayInputs } from "@shared/schema";
import { DashboardPanel, MetricStripe } from "@/components/dashboards/dashboard-panel";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP } from "@/lib/engine";
import { chartTheme } from "@/lib/chart-theme";
import { PackageStatusChip } from "./PackageStatusChip";
import { PackageCompletenessScore } from "./PackageCompletenessScore";
import { PACKAGE_DISCLAIMER, DASHBOARD_DISCLAIMER } from "@shared/complianceCopy";

interface RedundancyPackageDashboardProps {
  inputs: RunwayInputs;
  compact?: boolean;
}

export function RedundancyPackageDashboard({ inputs, compact = false }: RedundancyPackageDashboardProps) {
  const data = buildPackageDashboardData(inputs);

  return (
    <DashboardPanel
      title="Package estimate"
      subtitle="See the package components entered into your model and how they feed into your runway."
      testId="dashboard-redundancy-package"
      footer={DASHBOARD_DISCLAIMER}
    >
      {!compact && <PackageCompletenessScore inputs={inputs} compact />}
      <MetricStripe
        items={[
          {
            label: "Estimated statutory",
            value: formatGBP(data.estimate.statutoryRedundancy),
            stripe: chartTheme.color.s1,
            testId: "pkg-metric-statutory",
          },
          {
            label: "Notice / PILON",
            value: formatGBP(data.estimate.noticePay),
            stripe: chartTheme.color.s2,
            testId: "pkg-metric-notice",
          },
          {
            label: "Holiday pay",
            value: formatGBP(data.estimate.holidayPay),
            stripe: chartTheme.color.s3,
            testId: "pkg-metric-holiday",
          },
          {
            label: "Total package",
            value: formatGBP(data.packageTotal),
            stripe: chartTheme.color.redundancy,
            testId: "pkg-metric-total",
          },
        ]}
      />

      {!compact && (
        <p className="text-xs text-muted-foreground mb-4 -mt-2">
          Amount used in runway model: <span className="font-semibold text-foreground">{formatGBP(data.amountUsedInRunway)}</span>
        </p>
      )}

      {data.warnings.length > 0 && (
        <div className="space-y-2 mb-4">
          {data.warnings.map((w) => (
            <div
              key={w.warningKey}
              className={`rounded-lg border px-3 py-2 text-xs ${
                w.severity === "caution"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <p className="font-semibold mb-0.5">{w.title}</p>
              <p className="leading-relaxed">{w.body}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
        What could be included in a redundancy package?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.components.map((c) => (
          <div key={c.itemKey} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-primary leading-snug">{c.label}</p>
              <PackageStatusChip status={c.status} />
            </div>
            <p className="text-lg font-bold tabular-nums text-foreground mb-1">
              {c.amount != null && c.amount > 0 ? formatGBP(c.amount) : "—"}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.explanation}</p>
            {c.checkNote && (
              <p className="text-[10px] text-amber-800 mt-2 leading-relaxed">Check this figure: {c.checkNote}</p>
            )}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">{PACKAGE_DISCLAIMER}</p>
    </DashboardPanel>
  );
}
