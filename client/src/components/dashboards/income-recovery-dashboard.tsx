import { useState } from "react";
import { ComposedChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { ScenarioLeaderboard } from "@/components/scenario-leaderboard";
import { RriGauge } from "@/components/rri-gauge";
import { chartTheme } from "@/lib/chart-theme";
import { formatGBP, formatMonths, computeScenarios } from "@/lib/engine";
import type { VoluntaryRedundancyComparison } from "@shared/schema";

const SCENARIO_COLORS = [chartTheme.color.s1, chartTheme.color.s2, chartTheme.color.s3, chartTheme.color.s4];

function ScenarioOverlayChart({
  scenarios,
  highlighted,
  onHighlight,
}: {
  scenarios: ReturnType<typeof computeScenarios>;
  highlighted: number | null;
  onHighlight: (idx: number | null) => void;
}) {
  const maxMonths = Math.max(...scenarios.map((s) => (s.result.monthsUntilDepletion < 60 ? s.result.monthsUntilDepletion + 3 : 36)));
  const displayMax = Math.min(maxMonths, 60);

  const data = Array.from({ length: displayMax + 1 }, (_, month) => ({
    month,
    ...Object.fromEntries(
      scenarios.map((s, i) => [
        `scenario${i}`,
        s.result.projections[Math.min(month, s.result.projections.length - 1)]?.capital ?? 0,
      ]),
    ),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.color.grid} />
        <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} tick={{ fill: "#64748b", fontSize: 11 }} />
        <YAxis tickFormatter={(v) => formatGBP(v)} tick={{ fill: "#64748b", fontSize: 11 }} width={72} />
        <RechartsTooltip
          formatter={(value: number, name: string) => {
            const idx = parseInt(name.replace("scenario", ""));
            return [formatGBP(value), scenarios[idx]?.name ?? name];
          }}
          labelFormatter={(label) => `Month ${label}`}
          contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
        />
        <Legend
          formatter={(value: string) => {
            const idx = parseInt(value.replace("scenario", ""));
            return scenarios[idx]?.name ?? value;
          }}
          wrapperStyle={{ fontSize: "11px", cursor: "pointer" }}
          onClick={(e) => {
            const idx = parseInt(String(e.dataKey ?? "").replace("scenario", ""));
            if (!Number.isNaN(idx)) onHighlight(highlighted === idx ? null : idx);
          }}
        />
        {scenarios.map((_, i) => (
          <Line
            key={i}
            type="monotone"
            dataKey={`scenario${i}`}
            stroke={SCENARIO_COLORS[i]}
            strokeWidth={highlighted === null || highlighted === i ? 3 : 1}
            strokeOpacity={highlighted === null || highlighted === i ? 1 : 0.2}
            dot={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function StabilityBadge({ band, score }: { band: "Stable" | "Watch" | "High Pressure"; score: number }) {
  const variant = band === "Stable" ? "default" : band === "Watch" ? "secondary" : "destructive";
  return (
    <div className="flex items-center gap-1.5">
      <Badge variant={variant}>{band}</Badge>
      <span className="text-[10px] text-slate-500">{score}/100</span>
    </div>
  );
}

interface IncomeRecoveryDashboardProps {
  scenarios: ReturnType<typeof computeScenarios>;
  vrComparison?: VoluntaryRedundancyComparison | null;
}

export function IncomeRecoveryDashboard({ scenarios, vrComparison }: IncomeRecoveryDashboardProps) {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const widest = scenarios.reduce((best, s) => (s.result.monthsUntilDepletion > best.result.monthsUntilDepletion ? s : best), scenarios[0]);
  const narrowest = scenarios.reduce((worst, s) => (s.result.monthsUntilDepletion < worst.result.monthsUntilDepletion ? s : worst), scenarios[0]);

  return (
    <div className="space-y-5" data-testid="income-recovery-dashboard">
      <ScenarioLeaderboard scenarios={scenarios} title="Income recovery paths" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wide text-emerald-700 mb-1">Widest runway (modelled)</p>
          <p className="text-sm font-semibold text-[#1a3357]">{widest?.name}</p>
          <p className="text-lg font-bold text-emerald-700 tabular-nums">{widest ? formatMonths(widest.result.monthsUntilDepletion) : "—"}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wide text-amber-700 mb-1">Narrowest runway (modelled)</p>
          <p className="text-sm font-semibold text-[#1a3357]">{narrowest?.name}</p>
          <p className="text-lg font-bold text-amber-700 tabular-nums">{narrowest ? formatMonths(narrowest.result.monthsUntilDepletion) : "—"}</p>
        </div>
      </div>

      <DashboardPanel
        title="Scenario overlay"
        subtitle="Click a legend item to highlight one income recovery path. No path is presented as recommended."
        testId="panel-scenario-overlay"
      >
        <ScenarioOverlayChart scenarios={scenarios} highlighted={highlighted} onHighlight={setHighlighted} />
      </DashboardPanel>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((s, i) => (
          <Card key={i} className="border-t-4 border-slate-200 overflow-hidden" style={{ borderTopColor: SCENARIO_COLORS[i] }} data-testid={`card-scenario-${i}`}>
            <CardContent className="pt-4 pb-4">
              <p className="text-[10px] text-slate-500 mb-2 line-clamp-2">{s.name}</p>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-2xl font-bold text-[#1a3357] tabular-nums">{formatMonths(s.result.monthsUntilDepletion)}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Burn {formatGBP(s.result.monthlyBurn)}/mo</p>
                </div>
                <RriGauge score={s.result.stabilityScore} size={72} animate={false} />
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-slate-500">At 12 mo</span><span className="font-medium tabular-nums">{formatGBP(s.result.capitalAfter12Months)}</span></div>
                <StabilityBadge band={s.result.stabilityBand} score={s.result.stabilityScore} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vrComparison && (
        <DashboardPanel title="Voluntary redundancy comparison" subtitle="Statutory entitlement vs voluntary package entered." testId="panel-vr-comparison">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 p-3" data-testid="card-vr-statutory">
              <p className="text-[10px] text-slate-500">Statutory package</p>
              <p className="text-xl font-bold text-[#1a3357]">{formatGBP(vrComparison.statutoryPackageTotal)}</p>
              <p className="text-sm font-semibold text-primary mt-1">{formatMonths(vrComparison.statutoryRunway)}</p>
            </div>
            <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-3" data-testid="card-vr-voluntary">
              <p className="text-[10px] text-slate-500">Voluntary package</p>
              <p className="text-xl font-bold text-[#1a3357]">{formatGBP(vrComparison.vrPackageTotal)}</p>
              <p className="text-sm font-semibold text-primary mt-1">{formatMonths(vrComparison.vrRunway)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3" data-testid="card-vr-delta">
              <p className="text-[10px] text-slate-500">Runway difference</p>
              <p className="text-xl font-bold text-[#1a3357]">{vrComparison.delta >= 0 ? "+" : ""}{formatMonths(vrComparison.delta)}</p>
              <p className="text-sm font-semibold mt-1">{formatGBP(vrComparison.vrPackageTotal - vrComparison.statutoryPackageTotal)} capital</p>
            </div>
          </div>
        </DashboardPanel>
      )}
    </div>
  );
}
