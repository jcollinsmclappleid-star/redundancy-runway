import { useMemo } from "react";
import { Link } from "wouter";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatGBP, formatMonths } from "@/lib/engine";
import { buildMaximiserInsights } from "@/lib/position-enhancement/buildMaximiserInsights";
import { EXAMPLE_RUNWAY_INPUTS } from "@/lib/private-runway-brief/exampleInputs";
import {
  PRODUCT_COPY,
  REDUNDANCY_PAY_MAXIMISER_NAME,
  RUNWAY_REPORT_PRICE_GBP,
} from "@shared/product";

const STACK_COLORS: Record<string, string> = {
  statutory_redundancy: "bg-primary",
  enhanced_redundancy: "bg-violet-500",
  notice_pay: "bg-sky-500",
  holiday_pay: "bg-teal-500",
  savings: "bg-emerald-500",
};

interface MaximiserExampleStripProps {
  unlockHref?: string;
  compact?: boolean;
}

export function MaximiserExampleStrip({ unlockHref = "/unlock", compact = false }: MaximiserExampleStripProps) {
  const insights = useMemo(() => buildMaximiserInsights(EXAMPLE_RUNWAY_INPUTS), []);
  const packageSegments = insights.stackSegments.filter((s) => s.itemKey !== "savings");
  const stackTotal = packageSegments.reduce((sum, s) => sum + s.amount, 0) || insights.currentPackageTotal || 1;
  const topOpps = insights.rankedOpportunities.slice(0, 3);

  return (
    <div
      className="rounded-xl border-2 border-gold/35 bg-gradient-to-br from-amber-50/60 via-white to-white overflow-hidden shadow-md"
      data-testid="maximiser-example-strip"
    >
      <div className="px-4 sm:px-5 py-3 border-b border-gold/20 bg-primary/5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="text-sm font-bold text-primary">{REDUNDANCY_PAY_MAXIMISER_NAME}</p>
          <Badge variant="outline" className="text-[10px] border-gold/40 text-amber-900">
            Flagship tool
          </Badge>
        </div>
        <Badge className="bg-gold/20 text-primary border-gold/30 text-[10px]">Sample figures</Badge>
      </div>

      <div className={`px-4 sm:px-5 ${compact ? "py-4" : "py-5"} space-y-4`}>
        <p className="text-sm text-foreground/90 leading-relaxed">{insights.headline}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-lg border border-gold/15 bg-white p-3 text-center">
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Package in model</p>
            <p className="text-lg font-bold text-primary tabular-nums">{formatGBP(insights.currentPackageTotal)}</p>
          </div>
          <div className="rounded-lg border border-gold/15 bg-white p-3 text-center">
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Baseline runway</p>
            <p className="text-lg font-bold text-primary tabular-nums">{formatMonths(insights.currentRunwayMonths)}</p>
          </div>
          {insights.runwayProtectedVsStatutory > 0 && (
            <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 p-3 text-center">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">Vs statutory-only</p>
              <p className="text-lg font-bold text-emerald-800 tabular-nums">
                +{formatMonths(insights.runwayProtectedVsStatutory)}
              </p>
            </div>
          )}
          {insights.totalPotentialRunwayUplift != null && insights.totalPotentialRunwayUplift > 0 && (
            <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-3 text-center">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">Modelled upside</p>
              <p className="text-lg font-bold text-amber-900 tabular-nums">
                +{formatMonths(insights.totalPotentialRunwayUplift)}
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Package stack</p>
          <div className="flex h-7 rounded-lg overflow-hidden border border-slate-200">
            {packageSegments.map((seg) => (
              <div
                key={seg.itemKey}
                className={STACK_COLORS[seg.itemKey] ?? "bg-slate-400"}
                style={{ width: `${Math.max((seg.amount / stackTotal) * 100, seg.amount > 0 ? 6 : 0)}%` }}
                title={`${seg.label}: ${formatGBP(seg.amount)}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {insights.stackSegments.map((seg) => (
              <span key={seg.itemKey} className="text-[10px] text-muted-foreground">
                {seg.label}
                {seg.amount > 0 && (
                  <span className="ml-1 font-medium text-foreground/80 tabular-nums">{formatGBP(seg.amount)}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {topOpps.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-primary mb-2">Ranked opportunities (sample)</p>
            <ul className="space-y-2">
              {topOpps.map((opp) => (
                <li
                  key={opp.itemKey}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 flex flex-wrap items-center gap-2 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-gold/25 text-[10px] font-bold text-primary flex items-center justify-center shrink-0">
                    {opp.rank}
                  </span>
                  <span className="font-medium text-foreground flex-1 min-w-[120px]">{opp.label}</span>
                  {opp.runwayUpliftMonths != null && opp.runwayUpliftMonths > 0 && (
                    <span className="text-emerald-700 font-semibold tabular-nums">
                      +{formatMonths(opp.runwayUpliftMonths)} runway
                    </span>
                  )}
                  {opp.packageUplift != null && opp.packageUplift > 0 && (
                    <span className="text-primary font-semibold tabular-nums">+{formatGBP(opp.packageUplift)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Ranks what could change your package total and runway months under your assumptions — modelling only, not entitlement advice.
          Unlock for the full ladder, scenario comparisons and HR verification prompts.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Link href={unlockHref} className="flex-1 sm:flex-none">
            <Button size="sm" className="btn-gold w-full sm:w-auto" data-testid="button-maximiser-example-unlock">
              Unlock with your figures — £{RUNWAY_REPORT_PRICE_GBP}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
          <p className="text-[10px] text-muted-foreground self-center">{PRODUCT_COPY.unlockSupportingLine}</p>
        </div>
      </div>
    </div>
  );
}
