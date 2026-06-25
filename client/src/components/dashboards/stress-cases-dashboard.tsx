import { useMemo } from "react";
import { Home } from "lucide-react";
import { DashboardPanel, MetricStripe } from "@/components/dashboards/dashboard-panel";
import { AnimatedNumber } from "@/components/charts/animated-number";
import { chartTheme } from "@/lib/chart-theme";
import { formatGBP, formatMonths } from "@/lib/engine";
import type { SensitivityResult, MortgageSensitivityResult } from "@shared/schema";

import { SensitivityTornado } from "@/components/charts/sensitivity-tornado";
interface StressCasesDashboardProps {
  result: { monthsUntilDepletion: number; stabilityScore: number };
  sensitivityResults: SensitivityResult[];
  mortgageSensitivity?: MortgageSensitivityResult[];
  currentHousingCost?: number;
}

export function StressCasesDashboard({
  result,
  sensitivityResults,
  mortgageSensitivity = [],
  currentHousingCost,
}: StressCasesDashboardProps) {
  const worst = useMemo(
    () => sensitivityResults.reduce((w, r) => (r.difference < w.difference ? r : w), sensitivityResults[0]),
    [sensitivityResults],
  );

  return (
    <div className="space-y-5" data-testid="stress-cases-dashboard">
      <MetricStripe
        items={[
          { label: "Base runway", value: formatMonths(result.monthsUntilDepletion), stripe: chartTheme.color.s1 },
          { label: "RRI score", value: `${result.stabilityScore}/100`, stripe: chartTheme.color.s2 },
          {
            label: "Largest stress hit",
            value: worst ? `${worst.difference.toFixed(1)} mo` : "—",
            stripe: chartTheme.color.pressure,
          },
          { label: "Stress tests run", value: String(sensitivityResults.length), stripe: chartTheme.color.s4 },
        ]}
      />

      <DashboardPanel
        title="Assumption stress lab"
        subtitle="How the projection shifts when key variables change. These are not predictions."
        testId="panel-stress-tornado"
      >
        <SensitivityTornado
          items={sensitivityResults.map((s) => ({
            label: s.label,
            baseRunway: s.baseRunway,
            adjustedRunway: s.adjustedRunway,
            difference: s.difference,
          }))}
        />
      </DashboardPanel>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sensitivityResults.map((r, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-3" data-testid={`sensitivity-card-${i}`}>
            <p className="text-[10px] text-slate-500 mb-2 line-clamp-2">{r.label}</p>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber value={r.baseRunway} format={(v) => formatMonths(v)} className="text-lg font-bold text-slate-400 tabular-nums line-through" />
              <span className="text-slate-300">→</span>
              <AnimatedNumber value={r.adjustedRunway} format={(v) => formatMonths(v)} className="text-lg font-bold text-[#1a3357] tabular-nums" />
            </div>
            <p className={`text-xs font-semibold mt-1 tabular-nums ${r.difference < 0 ? "text-red-600" : r.difference > 0 ? "text-emerald-600" : "text-slate-500"}`}>
              {r.difference === 0 ? "No change" : `${r.difference > 0 ? "+" : ""}${r.difference.toFixed(1)} months`}
            </p>
          </div>
        ))}
      </div>

      {mortgageSensitivity.length > 0 && currentHousingCost !== undefined && (
        <DashboardPanel title="Housing pressure" subtitle="Impact of housing cost increases on the capital projection." testId="panel-housing-stress">
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
            <Home className="w-4 h-4 text-primary" />
            Current housing: <strong className="text-[#1a3357]">{formatGBP(currentHousingCost)}/mo</strong>
          </div>
          <div className="space-y-2">
            {mortgageSensitivity.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2" data-testid={`mortgage-sensitivity-${i}`}>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#1a3357]">{r.label}</p>
                  <p className="text-[10px] text-slate-500">{formatGBP(r.newHousingCost)}/mo housing</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold tabular-nums">{formatMonths(r.adjustedRunway)}</p>
                  <p className={`text-[10px] font-semibold ${r.difference < 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {r.difference > 0 ? "+" : ""}{r.difference.toFixed(1)} mo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
      )}
    </div>
  );
}
