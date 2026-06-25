import { Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { chartTheme, densifyProjection, hashSeed } from "@/lib/chart-theme";
import { formatGBP, formatMonths, type computeEssentialOnlyComparison } from "@/lib/engine";
import type { RunwayResult } from "@shared/schema";

type EssentialComparison = ReturnType<typeof computeEssentialOnlyComparison>;

function MilestoneTimeline({ milestones, maxMonth }: { milestones: RunwayResult["milestones"]; maxMonth: number }) {
  const range = Math.max(maxMonth, 1);
  return (
    <div className="relative pt-6 pb-2" data-testid="milestone-timeline">
      <div className="h-1.5 rounded-full bg-slate-100 relative">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 opacity-60" style={{ width: "100%" }} />
        {milestones.map((m, i) => {
          const left = `${Math.min(100, (m.month / range) * 100)}%`;
          const color = m.severity === "critical" ? chartTheme.color.pressure : m.severity === "warning" ? chartTheme.color.attention : chartTheme.color.s1;
          return (
            <div key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left }} data-testid={`milestone-pin-${i}`}>
              <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ background: color }} title={`Month ${m.month}: ${m.description}`} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-slate-400">
        <span>M0</span>
        <span>M{maxMonth}</span>
      </div>
    </div>
  );
}

function MiniCapitalSparkline({ projections }: { projections: RunwayResult["projections"] }) {
  const yearly = [0, 12, 24, 36, 48, 60].map((m) => projections[Math.min(m, projections.length - 1)]?.capital ?? 0);
  const dense = densifyProjection(yearly, hashSeed("pressure"));
  const W = 320, H = 48, P = 4;
  const min = Math.min(...dense), max = Math.max(...dense);
  const range = Math.max(1, max - min);
  const pts = dense.map((v, i) => {
    const x = P + (i / (dense.length - 1)) * (W - P * 2);
    const y = H - P - ((v - min) / range) * (H - P * 2);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12" preserveAspectRatio="xMidYMid meet">
      <path d={pts} fill="none" stroke={chartTheme.color.s1} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

interface PressurePointsDashboardProps {
  result: RunwayResult;
  essentialComparison: EssentialComparison;
  onCopySummary?: () => void;
  copied?: boolean;
}

export function PressurePointsDashboard({ result, essentialComparison }: PressurePointsDashboardProps) {
  const maxMonth = Math.min(60, result.monthsUntilDepletion < 60 ? result.monthsUntilDepletion + 6 : 36);
  const critical = result.milestones.filter((m) => m.severity === "critical").length;
  const warning = result.milestones.filter((m) => m.severity === "warning").length;
  const info = result.milestones.filter((m) => m.severity === "info").length;

  return (
    <div className="space-y-5" data-testid="pressure-points-dashboard">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Critical", count: critical, color: chartTheme.color.pressure },
          { label: "Warning", count: warning, color: chartTheme.color.attention },
          { label: "Info", count: info, color: chartTheme.color.s1 },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
            <p className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">{s.label} events</p>
          </div>
        ))}
      </div>

      <DashboardPanel
        title="Threshold timeline"
        subtitle="Projected capital threshold events along the runway under these assumptions."
        testId="panel-milestone-timeline"
      >
        {result.milestones.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-70" />
            <p className="text-sm text-slate-600">No threshold events within the projection period.</p>
            <p className="text-xs text-slate-500 mt-1">Capital remains above all modelled threshold levels.</p>
          </div>
        ) : (
          <>
            <MiniCapitalSparkline projections={result.projections} />
            <MilestoneTimeline milestones={result.milestones} maxMonth={maxMonth} />
            <div className="mt-5 space-y-3">
              {result.milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5" data-testid={`milestone-${i}`}>
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${m.severity === "critical" ? "bg-red-500" : m.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[#1a3357]">Month {m.month}</p>
                      <Badge variant={m.severity === "critical" ? "destructive" : m.severity === "warning" ? "secondary" : "outline"} data-testid={`badge-severity-${i}`}>
                        {m.severity === "critical" ? "Critical" : m.severity === "warning" ? "Warning" : "Info"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DashboardPanel>

      {essentialComparison.monthlySaving > 0 && (
        <DashboardPanel title="Essential-only comparison" subtitle="Illustrative impact if all non-essential spending were removed." testId="panel-essential-comparison">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Removing non-essential spending ({formatGBP(essentialComparison.monthlySaving)}/mo) would extend the projection by approximately{" "}
                <span className="font-semibold text-[#1a3357]">
                  {essentialComparison.extraMonths > 0 ? `${essentialComparison.extraMonths} months` : "no additional months"}
                </span>
                {essentialComparison.extraMonths > 0 && (
                  <> (from {formatMonths(essentialComparison.fullRunway)} to {formatMonths(essentialComparison.essentialOnlyRunway)})</>
                )}.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-50 border border-slate-100 p-2 text-center">
                  <p className="text-[9px] text-slate-500">Full spending</p>
                  <p className="font-bold text-[#1a3357]">{formatMonths(essentialComparison.fullRunway)}</p>
                </div>
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2 text-center">
                  <p className="text-[9px] text-emerald-700">Essentials only</p>
                  <p className="font-bold text-emerald-700">{formatMonths(essentialComparison.essentialOnlyRunway)}</p>
                </div>
              </div>
            </div>
          </div>
        </DashboardPanel>
      )}
    </div>
  );
}
