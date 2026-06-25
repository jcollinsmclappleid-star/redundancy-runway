import type { RunwayInputs } from "@shared/schema";
import { DashboardPanel, MetricStripe } from "@/components/dashboards/dashboard-panel";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP, UK_STATUTORY_REDUNDANCY } from "@/lib/engine";
import { chartTheme } from "@/lib/chart-theme";
import { DASHBOARD_DISCLAIMER } from "@shared/complianceCopy";

export function StatutoryEntitlementEstimateDashboard({ inputs }: { inputs: RunwayInputs }) {
  const data = buildPackageDashboardData(inputs);
  const pkg = inputs.redundancyPackage;

  return (
    <DashboardPanel
      title="Statutory redundancy estimate"
      subtitle="How the estimated statutory redundancy figure is formed from the assumptions entered. This does not decide legal entitlement."
      testId="dashboard-statutory-entitlement"
      footer={DASHBOARD_DISCLAIMER}
    >
      <MetricStripe
        items={[
          {
            label: "Estimated statutory",
            value: formatGBP(data.estimate.statutoryRedundancy),
            stripe: chartTheme.color.s1,
          },
          {
            label: "Weekly pay used",
            value: formatGBP(data.cappedWeeklyPay),
            stripe: chartTheme.color.s2,
          },
          {
            label: "Years of service",
            value: `${data.cappedYears} yrs`,
            stripe: chartTheme.color.s3,
          },
          {
            label: "Age entered",
            value: `${pkg.age}`,
            stripe: chartTheme.color.s4,
          },
        ]}
      />

      <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 mb-4 text-xs text-slate-700 leading-relaxed space-y-2">
        <p className="font-semibold text-slate-900">How this estimate is calculated (plain English)</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>½ week&apos;s pay for each full year of service when aged under 22</li>
          <li>1 week&apos;s pay for each full year aged 22 to 40</li>
          <li>1½ weeks&apos; pay for each full year aged 41 and over</li>
          <li>Subject to weekly pay cap ({formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)}) and {UK_STATUTORY_REDUNDANCY.maxServiceYears}-year service cap</li>
        </ul>
      </div>

      {data.statutoryBands.length > 0 ? (
        <div className="space-y-2 mb-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Age-band breakdown</p>
          {data.statutoryBands.map((b) => (
            <div key={b.label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <span className="text-muted-foreground text-xs">{b.label}</span>
              <span className="font-semibold tabular-nums">
                {b.weeks} wk → {formatGBP(b.amount)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          Enter age, service and weekly pay to see the age-band breakdown under your assumptions.
        </p>
      )}

      {data.warnings.map((w) => (
        <div
          key={w.warningKey}
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 mb-2"
        >
          <p className="font-semibold">{w.title}</p>
          <p className="mt-0.5 leading-relaxed">{w.body}</p>
        </div>
      ))}
    </DashboardPanel>
  );
}
