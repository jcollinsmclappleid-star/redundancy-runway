import { useState } from "react";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { chartTheme } from "@/lib/chart-theme";
import { formatGBP } from "@/lib/engine";
import type { SpendingImpact } from "@shared/schema";

const EFFORT_COLORS: Record<SpendingImpact["effort"], string> = {
  Low: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  High: "bg-rose-100 text-rose-800 border-rose-200",
};

function LeverRankChart({ items }: { items: SpendingImpact[] }) {
  const maxImpact = Math.max(...items.map((i) => i.runwayExtensionMonths), 0.1);
  const sorted = [...items].sort((a, b) => b.runwayExtensionMonths - a.runwayExtensionMonths);

  return (
    <div className="space-y-3" data-testid="lever-rank-chart">
      {sorted.map((item, i) => {
        const pct = item.runwayExtensionMonths > 0 ? (item.runwayExtensionMonths / maxImpact) * 100 : (item.reductionAmount / Math.max(...items.map((x) => x.reductionAmount))) * 40;
        return (
          <div key={i} data-testid={`lever-bar-${i}`}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-[#1a3357] truncate">{item.category}</span>
              <span className="text-xs font-bold tabular-nums shrink-0 text-primary">
                {item.runwayExtensionMonths > 0 ? `+${item.runwayExtensionMonths.toFixed(1)} mo` : `${formatGBP(item.reductionAmount * 12)}/yr`}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(8, pct)}%`, background: chartTheme.color.gold }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
              <span>Save {formatGBP(item.reductionAmount)}/mo</span>
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${EFFORT_COLORS[item.effort]}`}>{item.effort} effort</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ExpenseSensitivityDashboardProps {
  spendingImpacts: SpendingImpact[];
}

export function ExpenseSensitivityDashboard({ spendingImpacts }: ExpenseSensitivityDashboardProps) {
  const [showTable, setShowTable] = useState(false);

  if (spendingImpacts.length === 0) {
    return (
      <Card data-testid="expense-sensitivity-dashboard">
        <CardContent className="pt-8 pb-8 text-center">
          <p className="text-sm text-slate-600">No discretionary spending entered for analysis.</p>
        </CardContent>
      </Card>
    );
  }

  const topEasy = [...spendingImpacts].filter((i) => i.effort === "Low").sort((a, b) => b.runwayExtensionMonths - a.runwayExtensionMonths)[0];
  const allCapped = spendingImpacts.every((i) => i.runwayExtensionMonths <= 0);

  return (
    <div className="space-y-5" data-testid="expense-sensitivity-dashboard">
      {allCapped && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600">
            Runway already exceeds the 60-month projection window. Individual spending changes may not extend it further under these assumptions, but monthly savings below still represent modelled cashflow improvements.
          </p>
        </div>
      )}

      {topEasy && topEasy.runwayExtensionMonths > 0 && (
        <div className="rounded-xl border border-gold/40 bg-amber-50/60 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wide text-amber-800 mb-1">Largest low-effort lever (modelled)</p>
          <p className="text-sm font-semibold text-[#1a3357]">{topEasy.category}</p>
          <p className="text-lg font-bold text-amber-700">+{topEasy.runwayExtensionMonths.toFixed(1)} months runway</p>
        </div>
      )}

      <DashboardPanel
        title="Spending lever board"
        subtitle="Ranked by projected runway impact. This is not advice on which expenses to adjust."
        testId="panel-spending-levers"
      >
        <LeverRankChart items={spendingImpacts} />
      </DashboardPanel>

      <button
        type="button"
        onClick={() => setShowTable(!showTable)}
        className="text-xs font-semibold text-primary hover:underline"
        data-testid="toggle-spending-table"
      >
        {showTable ? "Hide detail table" : "View detail table"}
      </button>

      {showTable && (
        <Card className="border-slate-200" data-testid="card-spending-impact-table">
          <CardContent className="pt-4 pb-4 overflow-x-auto">
            <table className="w-full text-xs" data-testid="table-spending-impact">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-2 font-medium text-slate-500">Adjustment</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Current</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Saving</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Runway impact</th>
                  <th className="text-center py-2 px-2 font-medium text-slate-500">Effort</th>
                </tr>
              </thead>
              <tbody>
                {spendingImpacts.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0" data-testid={`spending-impact-${i}`}>
                    <td className="py-2 px-2">{item.category}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{formatGBP(item.currentAmount)}/mo</td>
                    <td className="py-2 px-2 text-right tabular-nums">{formatGBP(item.reductionAmount)}/mo</td>
                    <td className="py-2 px-2 text-right font-semibold text-primary">
                      {item.runwayExtensionMonths > 0 ? `+${item.runwayExtensionMonths.toFixed(1)} mo` : `${formatGBP(item.reductionAmount * 12)}/yr`}
                    </td>
                    <td className="py-2 px-2 text-center"><Badge variant="outline">{item.effort}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
