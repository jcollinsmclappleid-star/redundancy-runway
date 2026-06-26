import type { BriefDocument } from "@/lib/private-runway-brief/briefDocumentTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatGBP, formatMonths } from "@/lib/engine";
import type { BriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import { buildExecutiveSummaryFacts } from "@/lib/private-runway-brief/buildExecutiveSummaryFacts";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import type { RunwayInputs } from "@shared/schema";

interface StructuredExecutiveSummaryProps {
  document: BriefDocument;
  dashboard: BriefDashboardData;
  inputs: RunwayInputs;
}

export function StructuredExecutiveSummary({ document, dashboard, inputs }: StructuredExecutiveSummaryProps) {
  const facts = buildExecutiveSummaryFacts(dashboard);
  const packageTotal = buildPackageDashboardData(inputs).packageTotal;
  const exec = document.executive;

  return (
    <Card className="border border-gold/25 bg-white shadow-md rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-[hsl(220_52%_28%)] px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="text-[10px] bg-white/10 text-white border-white/20">
            Focus: {exec.focusLabel}
          </Badge>
          {exec.headlineSource === "ai" ? (
            <Badge variant="outline" className="text-[10px] bg-violet-500/20 text-violet-100 border-violet-400/30">
              AI-enhanced headline
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] bg-teal-500/20 text-teal-100 border-teal-400/30">
              Template headline
            </Badge>
          )}
        </div>
        <h2 className="font-serif text-lg sm:text-xl font-semibold text-white leading-snug">{exec.headline}</h2>
        <p className="text-xs text-white/70 mt-2 leading-relaxed">{exec.situationIntro}</p>
      </div>

      <CardContent className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Package in model", value: formatGBP(packageTotal) },
            { label: "Baseline months", value: formatMonths(dashboard.baseline.monthsUntilDepletion) },
            { label: "Severe case", value: formatMonths(dashboard.severeCaseRunway) },
            { label: "Starting capital", value: formatGBP(dashboard.baseline.startingCapital) },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-gold/15 bg-[hsl(40_30%_98%)] p-3 text-center">
              <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-1">{m.label}</p>
              <p className="text-base font-bold text-primary tabular-nums">{m.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold text-primary mb-3">Key findings under your assumptions</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {exec.findings.map((finding) => (
              <div
                key={finding.themeKey}
                className="rounded-lg border border-gold/15 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-xs font-semibold text-primary">{finding.title}</p>
                  <Badge variant="outline" className="text-[9px] shrink-0">
                    {finding.source === "ai" ? "AI" : finding.source === "template" ? "Guidance" : "Model"}
                  </Badge>
                </div>
                <p className="text-xs text-foreground/85 leading-relaxed">{finding.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-2">
          <p className="text-xs font-semibold text-[#1a3357]">What the model calculated</p>
          <p className="text-xs text-slate-700 leading-relaxed">{facts.modelCalculated.body}</p>
        </div>

        <p className="text-[10px] text-muted-foreground leading-relaxed border-t border-gold/10 pt-3">
          {exec.methodologyNote}
        </p>
      </CardContent>
    </Card>
  );
}
