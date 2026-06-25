import { useMemo } from "react";
import { useLocation } from "wouter";
import type { RunwayInputs } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { buildBriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import { computeRunway, formatGBP, formatMonths } from "@/lib/engine";
import { PRODUCT_COPY } from "@shared/product";

interface PersonalRunwayPreviewGapProps {
  inputs: RunwayInputs;
  locked?: boolean;
}

export function PersonalRunwayPreviewGap({ inputs, locked = false }: PersonalRunwayPreviewGapProps) {
  const [, navigate] = useLocation();
  const baseline = useMemo(() => computeRunway(inputs), [inputs]);
  const dashboard = useMemo(() => buildBriefDashboardData(inputs), [inputs]);

  const slowScenario = dashboard.scenarios.find((s) => s.scenarioKey === "slow_recovery");
  const topNegativeSens = dashboard.sensitivity.find((s) => s.differenceMonths < 0);
  const housingPoint = dashboard.pressurePoints.find((p) => p.pointKey === "housing");

  const gapLine = useMemo(() => {
    const parts: string[] = [];
    if (topNegativeSens) {
      parts.push(topNegativeSens.factor.replace(/^If /, "").replace(/ than assumed$/, ""));
    }
    if (dashboard.baseline.housingPercentOfEssentials >= 35) {
      parts.push("housing costs remain a material share of essentials");
    }
    if (parts.length === 0) {
      return "Under your assumptions, the full report shows every scenario side by side with a plain-English brief generated from your figures.";
    }
    return `Under your assumptions, ${parts.join(" and ")} appear to change the picture most. The full report shows every scenario side by side with a plain-English brief generated from your figures.`;
  }, [topNegativeSens, dashboard.baseline.housingPercentOfEssentials]);

  return (
    <Card className="border-gold/25 bg-gradient-to-br from-[hsl(40_30%_98%)] to-white" data-testid="card-personal-preview-gap">
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-2">Your figures — preview</p>
          <p className="text-sm text-foreground/85 leading-relaxed">{gapLine}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-lg border border-gold/15 bg-white p-3">
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Your baseline</p>
            <p className="text-lg font-bold text-primary tabular-nums">{formatMonths(baseline.monthsUntilDepletion)}</p>
          </div>
          <div className={`rounded-lg border border-amber-200/50 bg-amber-50/40 p-3 relative ${locked ? "overflow-hidden" : ""}`}>
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Slow case</p>
            <p className={`text-lg font-bold text-amber-800 tabular-nums ${locked ? "blur-[5px] select-none" : ""}`}>
              {formatMonths(slowScenario?.monthsUntilDepletion ?? baseline.monthsUntilDepletion)}
            </p>
            {locked && <div className="absolute inset-0 flex items-center justify-center bg-white/50"><span className="text-[10px] text-amber-700 font-medium">Locked</span></div>}
          </div>
          <div className={`rounded-lg border border-red-200/40 bg-red-50/30 p-3 relative ${locked ? "overflow-hidden" : ""}`}>
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Severe case</p>
            <p className={`text-lg font-bold text-red-800/90 tabular-nums ${locked ? "blur-[5px] select-none" : ""}`}>
              {formatMonths(dashboard.severeCaseRunway)}
            </p>
            {locked && <div className="absolute inset-0 flex items-center justify-center bg-white/50"><span className="text-[10px] text-red-700 font-medium">Locked</span></div>}
          </div>
          <div className="rounded-lg border border-gold/15 bg-white p-3">
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Net burn</p>
            <p className="text-lg font-bold text-primary tabular-nums">{formatGBP(baseline.monthlyBurn)}</p>
          </div>
        </div>

        {housingPoint && dashboard.baseline.housingPercentOfEssentials >= 30 && (
          <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
            <p className="text-xs font-semibold text-primary mb-1">Pressure point — housing</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Under your assumptions, housing is {dashboard.baseline.housingPercentOfEssentials}% of essential costs in
              this model ({housingPoint.formattedValue} per month).
            </p>
          </div>
        )}

        {topNegativeSens && !locked && (
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3">
            <p className="text-xs font-semibold text-[#1a3357] mb-1">What changes the picture most — model scenario</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {topNegativeSens.factor}: baseline runway moves by {formatMonths(Math.abs(topNegativeSens.differenceMonths))}{" "}
              in this stress test. Not a prediction.
            </p>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Illustrative modelling only. Not financial, legal, tax, employment, debt, mortgage, benefits or career advice.
          Does not predict job outcomes.
        </p>

        <Button className="btn-gold w-full" onClick={() => navigate("/unlock")} data-testid="button-personal-gap-unlock">
          {PRODUCT_COPY.fullScenarioCta}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
