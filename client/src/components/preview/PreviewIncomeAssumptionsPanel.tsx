import type { RunwayInputs } from "@shared/schema";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatGBP } from "@/lib/engine";
import {
  describeIncomePath,
  getGapIncome,
  hasIncomeRecoveryModelled,
} from "@/lib/runwayAssumptions";

interface PreviewIncomeAssumptionsPanelProps {
  inputs: RunwayInputs;
}

export function PreviewIncomeAssumptionsPanel({ inputs }: PreviewIncomeAssumptionsPanelProps) {
  const incomeModelled = hasIncomeRecoveryModelled(inputs);
  const gapIncome = getGapIncome(inputs);
  const jobGap = inputs.monthsUntilNewJob;

  return (
    <Card className="border-slate-200" data-testid="panel-income-assumptions">
      <CardContent className="pt-5 pb-5 space-y-4">
        <div>
          <p className="text-sm font-semibold text-primary">Income assumptions in this model</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Runway and resilience depend on these figures — planning assumptions only, not predictions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
            <p className="text-[10px] uppercase text-muted-foreground mb-0.5">Previous net income</p>
            <p className="font-semibold tabular-nums">
              {inputs.currentMonthlyNetIncome > 0 ? `${formatGBP(inputs.currentMonthlyNetIncome)}/mo` : "Not entered"}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
            <p className="text-[10px] uppercase text-muted-foreground mb-0.5">Gap-period income</p>
            <p className="font-semibold tabular-nums">
              {gapIncome > 0 ? `${formatGBP(gapIncome)}/mo` : "£0/mo"}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
            <p className="text-[10px] uppercase text-muted-foreground mb-0.5">Full pay resumes after</p>
            <p className="font-semibold tabular-nums">
              {inputs.currentMonthlyNetIncome > 0
                ? jobGap > 0
                  ? `${jobGap} months`
                  : "Immediately (month 1)"
                : jobGap > 0
                  ? `${jobGap} months (needs prior income)`
                  : "Not modelled"}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 px-3 py-2.5 sm:col-span-2">
            <p className="text-[10px] uppercase text-muted-foreground mb-0.5">Baseline path</p>
            <p className="text-xs text-foreground/85 leading-relaxed">{describeIncomePath(inputs)}</p>
          </div>
        </div>

        {!incomeModelled && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                Prior income is not entered. Runway is modelled as capital drawdown only. Add income detail in the
                full report after unlock.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
