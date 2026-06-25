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
import { TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DashboardPanel, MetricStripe } from "@/components/dashboards/dashboard-panel";
import { CapitalCompositionBar } from "@/components/capital-composition-bar";
import { chartTheme } from "@/lib/chart-theme";
import { formatGBP, formatMonths } from "@/lib/engine";
import type { RunwayResult, MonthProjection } from "@shared/schema";

function CapitalTrajectoryChart({
  projections,
  milestones,
}: {
  projections: MonthProjection[];
  milestones: RunwayResult["milestones"];
}) {
  const depletionIdx = projections.findIndex((p) => p.capital <= 0);
  const displayMax = depletionIdx > 0 ? Math.min(depletionIdx + 3, 60) : 36;
  const data = projections.filter((_, i) => i <= displayMax);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 16, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="capitalPathGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartTheme.color.s1} stopOpacity={0.25} />
            <stop offset="95%" stopColor={chartTheme.color.s1} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.color.grid} />
        <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} tick={{ fill: "#64748b", fontSize: 11 }} />
        <YAxis tickFormatter={(v) => formatGBP(v)} tick={{ fill: "#64748b", fontSize: 11 }} width={72} />
        <RechartsTooltip
          formatter={(value: number) => [formatGBP(value), "Capital"]}
          labelFormatter={(label) => `Month ${label}`}
          contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
        />
        {milestones.map((m, i) => (
          m.month <= displayMax && (
            <ReferenceLine
              key={i}
              x={m.month}
              stroke={m.severity === "critical" ? chartTheme.color.pressure : m.severity === "warning" ? chartTheme.color.attention : chartTheme.color.s1}
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
          )
        ))}
        {depletionIdx > 0 && (
          <ReferenceLine x={depletionIdx} stroke={chartTheme.color.pressure} strokeWidth={2} label={{ value: "Depletion", position: "top", fill: chartTheme.color.pressure, fontSize: 10 }} />
        )}
        <Area type="monotone" dataKey="capital" stroke={chartTheme.color.s1} strokeWidth={2.5} fill="url(#capitalPathGradient)" name="Capital" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MonthlyDataTable({ projections }: { projections: MonthProjection[] }) {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const relevantMonths = projections.filter((p) => p.month > 0);
  const displayMonths = showAll ? relevantMonths : relevantMonths.slice(0, 12);

  return (
    <Card className="border-slate-200" data-testid="card-monthly-table">
      <CardHeader
        className="cursor-pointer flex flex-row items-center justify-between gap-2 pb-3"
        onClick={() => setExpanded(!expanded)}
        data-testid="button-toggle-monthly-table"
      >
        <CardTitle className="text-sm font-medium text-[#1a3357]">Monthly projection detail</CardTitle>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs" data-testid="table-monthly-data">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-2 font-medium text-slate-500">Month</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Capital</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Income</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Expenses</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Net burn</th>
                </tr>
              </thead>
              <tbody>
                {displayMonths.map((p) => (
                  <tr key={p.month} className={`border-b border-slate-50 last:border-0 ${p.capital <= 0 ? "text-red-600" : ""}`} data-testid={`table-row-month-${p.month}`}>
                    <td className="py-1.5 px-2 font-medium">{p.month}</td>
                    <td className="py-1.5 px-2 text-right tabular-nums">{formatGBP(p.capital)}</td>
                    <td className="py-1.5 px-2 text-right tabular-nums">{formatGBP(p.income)}</td>
                    <td className="py-1.5 px-2 text-right tabular-nums">{formatGBP(p.expenses)}</td>
                    <td className={`py-1.5 px-2 text-right tabular-nums ${p.netBurn > 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {p.netBurn > 0 ? `−${formatGBP(p.netBurn)}` : `+${formatGBP(Math.abs(p.netBurn))}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {relevantMonths.length > 12 && (
            <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setShowAll(!showAll)} data-testid="button-toggle-all-months">
              {showAll ? "Show first 12 months" : `Show all ${relevantMonths.length} months`}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface CapitalPathDashboardProps {
  result: RunwayResult;
  composition: { label: string; value: number; color: string }[];
}

export function CapitalPathDashboard({ result, composition }: CapitalPathDashboardProps) {
  const endingCapital = result.projections[result.projections.length - 1]?.capital ?? 0;
  const fuelSegments = [
    { label: "Remaining", value: Math.max(0, endingCapital), color: endingCapital > result.startingCapital * 0.25 ? chartTheme.color.s2 : chartTheme.color.attention },
    { label: "Used", value: Math.max(0, result.startingCapital - endingCapital), color: chartTheme.color.s1 },
  ].filter((s) => s.value > 0);

  return (
    <div className="space-y-5" data-testid="capital-path-dashboard">
      <MetricStripe
        items={[
          { label: "Estimated runway", value: formatMonths(result.monthsUntilDepletion), stripe: chartTheme.color.s1, testId: "dash-runway" },
          { label: "Starting capital", value: formatGBP(result.startingCapital), stripe: chartTheme.color.cash, testId: "dash-capital" },
          { label: "Net monthly burn", value: formatGBP(result.monthlyBurn), stripe: chartTheme.color.attention, testId: "dash-burn" },
          { label: "Essential / flexible", value: `${formatGBP(result.essentialExpenses)} / ${formatGBP(result.nonEssentialExpenses)}`, stripe: chartTheme.color.s3, testId: "dash-split" },
        ]}
      />

      <div className="grid grid-cols-3 gap-2 mb-1">
        {[
          { label: "3 mo", value: result.capitalAfter3Months },
          { label: "6 mo", value: result.capitalAfter6Months },
          { label: "12 mo", value: result.capitalAfter12Months },
        ].map((item) => (
          <div key={item.label} className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-center">
            <p className="text-[9px] uppercase text-slate-400">Capital at {item.label}</p>
            <p className="text-sm font-bold text-[#1a3357] tabular-nums">{formatGBP(item.value)}</p>
          </div>
        ))}
      </div>

      <DashboardPanel
        title="Capital trajectory"
        subtitle="Dashed lines mark projected threshold events under these assumptions."
        testId="panel-capital-trajectory"
      >
        <CapitalTrajectoryChart projections={result.projections} milestones={result.milestones} />
      </DashboardPanel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardPanel title="Capital position" subtitle="Starting vs projected ending capital." testId="panel-capital-fuel">
          <CapitalCompositionBar segments={fuelSegments.length > 0 ? fuelSegments : composition} />
          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>Start: <strong className="text-[#1a3357]">{formatGBP(result.startingCapital)}</strong></span>
            <span>Projected end: <strong className="text-[#1a3357]">{formatGBP(endingCapital)}</strong></span>
          </div>
        </DashboardPanel>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex gap-3" data-testid="card-capital-recovery">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <TrendingDown className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a3357] mb-1">Capital recovery</p>
            {result.capitalRecovery.recovers ? (
              <p className="text-xs text-slate-600 leading-relaxed" data-testid="text-recovery-positive">
                Under these assumptions, capital would return to starting level at month{" "}
                <span className="font-semibold">{result.capitalRecovery.recoveryMonth}</span>
                {result.capitalRecovery.rebuildDuration !== null && <> ({result.capitalRecovery.rebuildDuration} months post-reemployment)</>}.
              </p>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed" data-testid="text-recovery-negative">
                Under these assumptions, capital does not return to the starting level within the 60-month projection window.
              </p>
            )}
            {result.capitalRecovery.recovers && (
              <p className="text-xs text-slate-500 mt-2" data-testid="text-capital-12m-post">
                Capital at 12 months post-reemployment: {formatGBP(result.capitalRecovery.capitalAt12MonthsPostReemployment)}
              </p>
            )}
          </div>
        </div>
      </div>

      <MonthlyDataTable projections={result.projections} />
    </div>
  );
}
