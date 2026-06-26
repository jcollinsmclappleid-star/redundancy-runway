import { useMemo } from "react";
import type { RunwayInputs } from "@shared/schema";
import { buildPositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { POSITION_ENHANCEMENT_DISCLAIMER } from "@shared/complianceCopy";
import { formatGBP, formatMonths } from "@/lib/engine";

interface PositionEnhancementBriefAppendixProps {
  inputs: RunwayInputs;
}

const SITUATION_LABELS = {
  at_risk: "At risk of redundancy",
  post_redundancy: "Recently redundant",
  other: "Other situation",
} as const;

export function PositionEnhancementBriefAppendix({ inputs }: PositionEnhancementBriefAppendixProps) {
  const data = useMemo(() => buildPositionEnhancementData(inputs), [inputs]);

  const opportunities = [
    ...data.maximiser.couldIncreaseTotal,
    ...data.maximiser.notYetIncluded,
    ...data.maximiser.highValueToClarify,
  ].slice(0, 6);

  const missingItems = data.missingMoney.filter((m) => m.status === "missing" || m.status === "unclear").slice(0, 5);
  const scenarioRows = data.payoutScenarios.filter((s) => s.scenarioKey !== "current_entered").slice(0, 4);

  return (
    <DashboardPanel
      title="Improve your position — report appendix"
      subtitle="Package maximiser, missing-money checks, payout scenarios and preparation gaps from your assumptions."
      testId="brief-position-enhancement-appendix"
      footer={POSITION_ENHANCEMENT_DISCLAIMER}
    >
      <p className="text-xs text-muted-foreground mb-4">
        Situation context: <span className="font-medium text-foreground">{SITUATION_LABELS[data.situationType]}</span>
      </p>

      {opportunities.length > 0 && (
        <div className="mb-5 break-inside-avoid">
          <p className="text-xs font-semibold text-primary mb-2">Package understanding opportunities</p>
          <ul className="space-y-2">
            {opportunities.map((item) => (
              <li key={item.itemKey} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs">
                <div className="flex justify-between gap-2 mb-0.5">
                  <span className="font-medium text-foreground">{item.label}</span>
                  {item.amount != null && item.amount > 0 && (
                    <span className="tabular-nums font-semibold shrink-0">{formatGBP(item.amount)}</span>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {missingItems.length > 0 && (
        <div className="mb-5 break-inside-avoid">
          <p className="text-xs font-semibold text-primary mb-2">Missing or unclear in your model</p>
          <ul className="space-y-2">
            {missingItems.map((item) => (
              <li key={item.itemKey} className="rounded-lg border border-amber-200/70 bg-amber-50/40 px-3 py-2.5 text-xs">
                <p className="font-medium text-foreground mb-0.5">
                  {item.label}{" "}
                  <span className="font-normal text-muted-foreground">({item.status.replace("_", " ")})</span>
                </p>
                <p className="text-muted-foreground leading-relaxed">{item.whyItMatters}</p>
                <p className="text-[10px] text-muted-foreground/80 mt-1">Where to check: {item.whereToCheck}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {scenarioRows.length > 0 && (
        <div className="mb-5 break-inside-avoid overflow-x-auto">
          <p className="text-xs font-semibold text-primary mb-2">Payout improvement scenarios (model)</p>
          <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-2 py-2 font-semibold text-primary">Scenario</th>
                <th className="px-2 py-2 font-semibold text-primary text-right">Package</th>
                <th className="px-2 py-2 font-semibold text-primary text-right">Baseline months</th>
                <th className="px-2 py-2 font-semibold text-primary text-right">vs current</th>
              </tr>
            </thead>
            <tbody>
              {scenarioRows.map((row) => (
                <tr key={row.scenarioKey} className="border-t border-slate-100">
                  <td className="px-2 py-2 text-foreground">{row.label}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{formatGBP(row.packageTotal)}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{formatMonths(row.baselineRunwayMonths)}</td>
                  <td className="px-2 py-2 text-right tabular-nums text-muted-foreground">
                    {row.deltaVsCurrent > 0 ? "+" : ""}
                    {row.deltaVsCurrent !== 0 ? formatMonths(row.deltaVsCurrent) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.leverageMap.length > 0 && (
        <div className="break-inside-avoid">
          <p className="text-xs font-semibold text-primary mb-2">Decision leverage map</p>
          <ul className="space-y-2">
            {data.leverageMap.slice(0, 5).map((item) => (
              <li key={item.itemKey} className="rounded-lg border border-primary/10 bg-primary/5 px-3 py-2.5 text-xs">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-muted-foreground mt-0.5">{item.currentStatus}</p>
                <p className="text-foreground/80 mt-1">{item.improvementOpportunity}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardPanel>
  );
}
