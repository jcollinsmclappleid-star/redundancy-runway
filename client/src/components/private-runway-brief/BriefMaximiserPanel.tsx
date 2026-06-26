import { useMemo } from "react";
import type { RunwayInputs } from "@shared/schema";
import type { MaximiserInsights } from "@/lib/position-enhancement/buildMaximiserInsights";
import { buildMaximiserInsights } from "@/lib/position-enhancement/buildMaximiserInsights";
import { useMaximiserInsights } from "@/hooks/use-maximiser-insights";
import { BriefReportLayer } from "./BriefReportLayer";
import { formatGBP, formatMonths } from "@/lib/engine";
import { POSITION_ENHANCEMENT_DISCLAIMER } from "@shared/complianceCopy";
import { REDUNDANCY_PAY_MAXIMISER_NAME } from "@shared/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TrendingUp, Package, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STACK_COLORS: Record<string, string> = {
  statutory_redundancy: "bg-primary",
  enhanced_redundancy: "bg-violet-500",
  manual_package: "bg-violet-600",
  notice_pay: "bg-sky-500",
  holiday_pay: "bg-teal-500",
  unpaid_wages: "bg-amber-500",
  savings: "bg-emerald-500",
};

import { BriefMaximiserLockedTeaser } from "./BriefMaximiserLockedTeaser";

interface BriefMaximiserPanelProps {
  inputs: RunwayInputs;
  locked?: boolean;
}

function MetricTile({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof Package;
}) {
  return (
    <div className="rounded-lg border border-gold/20 bg-white/80 px-3 py-3 min-w-[140px] flex-1">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p className="text-lg font-bold text-primary tabular-nums leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function PackageStackBar({ insights }: { insights: MaximiserInsights }) {
  const packageSegments = insights.stackSegments.filter((s) => s.itemKey !== "savings");
  const total = packageSegments.reduce((sum, s) => sum + s.amount, 0) || insights.currentPackageTotal || 1;

  return (
    <div className="space-y-2">
      <div className="flex h-8 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
        {packageSegments.map((seg) => (
          <div
            key={seg.itemKey}
            className={cn(
              "relative group transition-all min-w-[4px]",
              STACK_COLORS[seg.itemKey] ?? "bg-slate-400",
              seg.status === "unmodelled" && "opacity-50",
            )}
            style={{ width: `${Math.max((seg.amount / total) * 100, seg.amount > 0 ? 4 : 0)}%` }}
            title={`${seg.label}: ${formatGBP(seg.amount)}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {insights.stackSegments.map((seg) => (
          <span key={seg.itemKey} className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className={cn("w-2 h-2 rounded-sm shrink-0", STACK_COLORS[seg.itemKey] ?? "bg-slate-400")} />
            {seg.label}
            {seg.amount > 0 && <span className="tabular-nums font-medium text-foreground/80">{formatGBP(seg.amount)}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BriefMaximiserPanel({ inputs, locked = false }: BriefMaximiserPanelProps) {
  if (locked) {
    return <BriefMaximiserLockedTeaser />;
  }

  const localInsights = useMemo(() => buildMaximiserInsights(inputs), [inputs]);
  const { data: apiInsights, isLoading } = useMaximiserInsights(inputs);
  const insights: MaximiserInsights = apiInsights ?? localInsights;

  const topThree = insights.rankedOpportunities.slice(0, 3);
  const hasUplift = insights.totalPotentialRunwayUplift != null && insights.totalPotentialRunwayUplift > 0;

  return (
    <BriefReportLayer
      layerId="maximiser-hero"
      title={REDUNDANCY_PAY_MAXIMISER_NAME}
      subtitle={insights.subheadline}
      badge={`${insights.completenessLabel} · Flagship`}
      priority="hero"
      footer={POSITION_ENHANCEMENT_DISCLAIMER}
      testId="brief-maximiser-hero"
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-foreground/90 mb-3">{insights.headline}</p>
          {isLoading && (
            <p className="text-[10px] text-muted-foreground mb-2">Refreshing modelled insights…</p>
          )}
          <div className="flex flex-wrap gap-2">
            <MetricTile label="Package in model" value={formatGBP(insights.currentPackageTotal)} icon={Package} />
            <MetricTile
              label="Baseline runway"
              value={formatMonths(insights.currentRunwayMonths)}
              sub={`Starting capital ${formatGBP(insights.startingCapital)}`}
              icon={Clock}
            />
            {insights.runwayProtectedVsStatutory > 0 && (
              <MetricTile
                label="Vs statutory-only"
                value={`+${formatMonths(insights.runwayProtectedVsStatutory)}`}
                sub={`${formatGBP(insights.packageAboveStatutory)} package`}
                icon={TrendingUp}
              />
            )}
            {hasUplift && insights.bestCaseRunwayMonths != null && (
              <MetricTile
                label="Modelled upside"
                value={`+${formatMonths(insights.totalPotentialRunwayUplift!)}`}
                sub={
                  insights.totalPotentialPackageUplift != null
                    ? `Up to ${formatGBP(insights.totalPotentialPackageUplift)} package`
                    : undefined
                }
                icon={TrendingUp}
              />
            )}
          </div>
        </div>

        <PackageStackBar insights={insights} />

        {topThree.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-primary mb-2">Ranked opportunities (by modelled runway impact)</p>
            <Accordion type="single" collapsible defaultValue={topThree[0]?.itemKey} className="space-y-2">
              {topThree.map((opp) => (
                <AccordionItem
                  key={opp.itemKey}
                  value={opp.itemKey}
                  className="rounded-lg border border-slate-200 bg-white px-3 overflow-hidden"
                >
                  <AccordionTrigger className="py-3 hover:no-underline text-left">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-gold/20 text-[10px] font-bold text-primary flex items-center justify-center">
                        {opp.rank}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate">{opp.label}</span>
                      <div className="ml-auto flex items-center gap-2 shrink-0">
                        {opp.packageUplift != null && opp.packageUplift > 0 && (
                          <span className="text-[10px] tabular-nums text-emerald-700 font-semibold">
                            +{formatGBP(opp.packageUplift)}
                          </span>
                        )}
                        {opp.runwayUpliftMonths != null && opp.runwayUpliftMonths > 0 && (
                          <span className="text-[10px] tabular-nums text-primary font-semibold">
                            +{formatMonths(opp.runwayUpliftMonths)}
                          </span>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <p className="text-xs text-foreground/85 leading-relaxed mb-1">{opp.summary}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{opp.detail}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {insights.scenarioLadder.length > 1 && (
          <details className="group rounded-lg border border-slate-200 bg-white/60">
            <summary className="flex items-center gap-2 cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-primary hover:bg-slate-50/80 rounded-lg">
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
              Package scenario ladder
              <span className="font-normal text-muted-foreground ml-1">— compare totals and runway</span>
            </summary>
            <div className="px-3 pb-3 overflow-x-auto">
              <table className="w-full text-[10px] mt-1">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-slate-100">
                    <th className="py-1.5 font-medium">Scenario</th>
                    <th className="py-1.5 font-medium text-right">Package</th>
                    <th className="py-1.5 font-medium text-right">Runway</th>
                    <th className="py-1.5 font-medium text-right">Δ vs current</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.scenarioLadder.map((row) => (
                    <tr
                      key={row.scenarioKey}
                      className={cn(
                        "border-b border-slate-50",
                        row.scenarioKey === "current_entered" && "bg-gold/5 font-medium",
                      )}
                    >
                      <td className="py-1.5 pr-2">{row.label}</td>
                      <td className="py-1.5 text-right tabular-nums">{formatGBP(row.packageTotal)}</td>
                      <td className="py-1.5 text-right tabular-nums">{formatMonths(row.baselineRunwayMonths)}</td>
                      <td className="py-1.5 text-right tabular-nums">
                        {row.deltaRunwayVsCurrent !== 0 ? (
                          <span className={row.deltaRunwayVsCurrent > 0 ? "text-emerald-700" : "text-muted-foreground"}>
                            {row.deltaRunwayVsCurrent > 0 ? "+" : ""}
                            {formatMonths(row.deltaRunwayVsCurrent)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
      </div>
    </BriefReportLayer>
  );
}
