import { useState } from "react";
import type { RunwayInputs } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PAYOUT_SCENARIO_DISCLAIMER } from "@shared/complianceCopy";
import {
  computeCustomPayoutScenario,
  type PositionEnhancementData,
} from "@/lib/position-enhancement/buildPositionEnhancementData";
import { formatGBP, formatMonths } from "@/lib/engine";
import { PositionModulePanel } from "./PositionModulePanel";

interface PayoutImprovementScenariosProps {
  inputs: RunwayInputs;
  data: PositionEnhancementData;
}

export function PayoutImprovementScenarios({ inputs, data }: PayoutImprovementScenariosProps) {
  const [customDelta, setCustomDelta] = useState(5000);
  const customTotal = Math.max(0, data.currentPackageTotal + customDelta);
  const customScenario = computeCustomPayoutScenario(
    inputs,
    customTotal,
    data.currentPackageTotal,
    data.payoutScenarios[0]?.packageTotal ?? 0,
  );

  return (
    <PositionModulePanel
      title="Payout improvement scenarios"
      subtitle="Model how different package outcomes could change your runway."
      testId="module-payout-scenarios"
      disclaimer={PAYOUT_SCENARIO_DISCLAIMER}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-[10px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3">Scenario</th>
              <th className="py-2 pr-3">Package total</th>
              <th className="py-2 pr-3">Starting capital</th>
              <th className="py-2 pr-3">Baseline runway</th>
              <th className="py-2 pr-3">Severe-case runway</th>
              <th className="py-2">vs statutory-only</th>
            </tr>
          </thead>
          <tbody>
            {data.payoutScenarios.map((row) => (
              <tr key={row.scenarioKey} className="border-b border-slate-100">
                <td className="py-2.5 pr-3 font-medium">{row.label}</td>
                <td className="py-2.5 pr-3 tabular-nums">{formatGBP(row.packageTotal)}</td>
                <td className="py-2.5 pr-3 tabular-nums">{formatGBP(row.startingCapital)}</td>
                <td className="py-2.5 pr-3 tabular-nums">{formatMonths(row.baselineRunwayMonths)}</td>
                <td className="py-2.5 pr-3 tabular-nums">{formatMonths(row.severeRunwayMonths)}</td>
                <td className="py-2.5 tabular-nums">
                  {row.deltaVsStatutory >= 0 ? "+" : ""}
                  {row.deltaVsStatutory.toFixed(1)} mo
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl border border-primary/15 bg-primary/5 p-4 space-y-3">
        <p className="text-sm font-semibold text-primary">Custom package change</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="custom-delta" className="text-xs">
              Package change (£)
            </Label>
            <Input
              id="custom-delta"
              type="number"
              step={500}
              value={customDelta}
              onChange={(e) => setCustomDelta(Number(e.target.value) || 0)}
              className="w-32 mt-1"
            />
          </div>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            If the package total were {formatGBP(Math.abs(customDelta))} {customDelta >= 0 ? "higher" : "lower"}, the
            modelled runway would move from {formatMonths(data.payoutScenarios.find((s) => s.scenarioKey === "current_entered")?.baselineRunwayMonths ?? 0)} to{" "}
            {formatMonths(customScenario.baselineRunwayMonths)}.
          </p>
        </div>
      </div>
    </PositionModulePanel>
  );
}
