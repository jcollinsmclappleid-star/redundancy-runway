import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sparkles } from "lucide-react";
import { DashboardPanel, MetricStripe } from "@/components/dashboards/dashboard-panel";
import { CapitalCompositionBar, CapitalCompositionLegend } from "@/components/capital-composition-bar";
import { RriGauge } from "@/components/rri-gauge";
import { chartTheme, gaugeColor, fmtK } from "@/lib/chart-theme";
import { formatGBP, formatMonths } from "@/lib/engine";
import type { BriefDashboardData, BriefPathScenario } from "@/lib/private-runway-brief/buildBriefDashboardData";

const TONE_CLS: Record<BriefPathScenario["tagTone"], string> = {
  balanced: "bg-cyan-400/15 text-cyan-700 border-cyan-400/30",
  sustain: "bg-emerald-400/15 text-emerald-700 border-emerald-400/30",
  stretch: "bg-amber-400/15 text-amber-700 border-amber-400/30",
  complex: "bg-violet-400/15 text-violet-700 border-violet-400/30",
};

function CapitalTrajectoryArea({
  scenario,
}: {
  scenario: BriefPathScenario;
}) {
  const depletionIdx = scenario.depletionMonth ?? -1;
  const displayMax =
    depletionIdx > 0 ? Math.min(depletionIdx + 3, 60) : Math.min(36, scenario.projections.length - 1);
  const data = scenario.projections.filter((_, i) => i <= displayMax);
  const gradientId = `briefPathGrad-${scenario.scenarioKey}`;

  return (
    <ResponsiveContainer width="100%" height={300} className="print:bg-white">
      <AreaChart data={data} margin={{ top: 16, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={scenario.color} stopOpacity={0.28} />
            <stop offset="95%" stopColor={scenario.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.color.grid} />
        <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} tick={{ fill: "#64748b", fontSize: 11 }} />
        <YAxis tickFormatter={(v) => formatGBP(v)} tick={{ fill: "#64748b", fontSize: 11 }} width={72} />
        <RechartsTooltip
          formatter={(value: number) => [formatGBP(value), "Capital"]}
          labelFormatter={(label) => `Month ${label}`}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        {scenario.milestones.map((m, i) =>
          m.month <= displayMax ? (
            <ReferenceLine
              key={i}
              x={m.month}
              stroke={
                m.severity === "critical"
                  ? chartTheme.color.pressure
                  : m.severity === "warning"
                    ? chartTheme.color.attention
                    : chartTheme.color.s1
              }
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
          ) : null,
        )}
        {depletionIdx > 0 && (
          <ReferenceLine
            x={depletionIdx}
            stroke={chartTheme.color.pressure}
            strokeWidth={2}
            label={{ value: "Depletion", position: "top", fill: chartTheme.color.pressure, fontSize: 10 }}
          />
        )}
        <Area
          type="monotone"
          dataKey="capital"
          stroke={scenario.color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          name="Capital"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface BriefRunwayPathDashboardProps {
  dashboard: BriefDashboardData;
  commentary?: string;
}

export function BriefRunwayPathDashboard({ dashboard, commentary }: BriefRunwayPathDashboardProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scenarios = dashboard.pathScenarios;
  const active = scenarios[Math.min(activeIdx, scenarios.length - 1)];
  if (!active) return null;

  const rriColor = gaugeColor(active.stabilityScore);

  return (
    <div className="space-y-4" data-testid="brief-runway-path-dashboard">
      <MetricStripe
        items={[
          {
            label: "Estimated runway",
            value: formatMonths(active.monthsUntilDepletion),
            stripe: active.color,
          },
          {
            label: "Starting capital",
            value: formatGBP(active.startingCapital),
            stripe: chartTheme.color.cash,
          },
          {
            label: "Net monthly burn",
            value: formatGBP(active.monthlyBurn),
            stripe: chartTheme.color.attention,
          },
          {
            label: "RRI score",
            value: `${active.stabilityScore}/100`,
            stripe: rriColor.stroke,
          },
        ]}
      />

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-900/5 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <div className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <Sparkles className="w-3 h-3 text-gold/70" />
            <span>Runway path · model output</span>
          </div>
          <div className="w-12" />
        </div>

        <div className="px-4 pt-4 pb-3 border-b border-slate-100">
          <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400 font-medium mb-2">
            Switch income recovery path
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {scenarios.map((s, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={s.scenarioKey}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  data-testid={`brief-path-chip-${s.scenarioKey}`}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border ${
                    isActive
                      ? "bg-gold text-[#0B1220] border-gold"
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {s.shortName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center gap-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${TONE_CLS[active.tagTone]}`}>
            {active.tag}
          </span>
          <p className="text-xs text-slate-500 flex-1 min-w-0">{active.whatChanged}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 p-4 border-b border-slate-100 bg-slate-50/40">
          {[
            { label: "3 mo", value: active.capitalAfter3Months },
            { label: "6 mo", value: active.capitalAfter6Months },
            { label: "12 mo", value: active.capitalAfter12Months },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-white border border-slate-100 p-2.5 text-center">
              <p className="text-[9px] uppercase text-slate-400">Capital at {item.label}</p>
              <p className="text-sm font-bold text-[#1a3357] tabular-nums">{formatGBP(item.value)}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-px bg-slate-100">
          <div className="bg-white p-4 space-y-4">
            <DashboardPanel
              title="Capital trajectory"
              subtitle="Dashed lines mark projected threshold events under this scenario."
              testId="brief-panel-capital-trajectory"
            >
              <CapitalTrajectoryArea scenario={active} />
            </DashboardPanel>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  Starting capital composition
                </p>
                <p className="text-[10px] font-mono text-slate-400">{formatGBP(active.startingCapital)}</p>
              </div>
              <CapitalCompositionBar segments={dashboard.compositionBar} />
              <CapitalCompositionLegend segments={dashboard.compositionBar} maxItems={4} />
            </div>
          </div>

          <div className="bg-white p-4 flex flex-col gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-2">
                Runway Resilience Indicator
              </p>
              <div className="flex justify-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                <RriGauge score={active.stabilityScore} size={140} label={rriColor.label.toUpperCase()} animate={false} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-2 py-2 text-center">
                <p className="text-[9px] text-slate-400">Path</p>
                <p className="text-[10px] font-semibold text-[#1a3357] truncate">{active.shortName}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-2 py-2 text-center">
                <p className="text-[9px] text-slate-400">Ending capital</p>
                <p className="text-sm font-bold tabular-nums" style={{ color: rriColor.stroke }}>
                  {fmtK(active.endingCapital)}
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2">
              <p className="text-[9px] text-slate-400 mb-1">Stability band</p>
              <p className="text-sm font-semibold text-[#1a3357]">{active.stabilityBand}</p>
            </div>
          </div>
        </div>
      </div>

      {commentary && (
        <div className="p-4 rounded-xl border border-gold/15 bg-white shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-1">What the range shows</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{commentary}</p>
        </div>
      )}
    </div>
  );
}
