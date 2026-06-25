import { Link } from "wouter";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RunwayBriefMetricGrid } from "./RunwayBriefMetricGrid";
import { BriefRunwayPathDashboard } from "./BriefRunwayPathDashboard";
import { formatGBP, formatMonths } from "@/lib/engine";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import {
  getSampleBriefDashboard,
  SAMPLE_EXAMPLE_FRAMING,
  SAMPLE_EXAMPLE_LABEL,
  SAMPLE_PRIVATE_RUNWAY_NARRATIVE,
  EXAMPLE_RUNWAY_INPUTS,
} from "@/lib/private-runway-brief/sampleExample";
import { PRODUCT_COPY, RUNWAY_BRIEF_NAME, RUNWAY_REPORT_FULL } from "@shared/product";

const THEME_LABELS: Record<string, string> = {
  starting_capital: "Starting capital",
  monthly_pressure: "Monthly pressure",
  scenario_spread: "Scenario spread",
  housing_pressure: "Housing pressure",
  sensitivity: "What changes the picture most",
};

interface BriefExampleEmbedProps {
  /** Primary CTA — defaults to wizard */
  primaryHref?: string;
  primaryLabel?: string;
  /** Show secondary link to full example page */
  showFullExampleLink?: boolean;
  className?: string;
}

export function BriefExampleEmbed({
  primaryHref = "/wizard",
  primaryLabel = PRODUCT_COPY.buildCta,
  showFullExampleLink = true,
  className = "",
}: BriefExampleEmbedProps) {
  const dashboard = getSampleBriefDashboard();
  const narrative = SAMPLE_PRIVATE_RUNWAY_NARRATIVE;
  const packageData = buildPackageDashboardData(EXAMPLE_RUNWAY_INPUTS);
  const exec = narrative.executiveSummary;
  const slowScenario = dashboard.scenarios.find((s) => s.scenarioKey === "slow_recovery");
  const topNegativeSens = dashboard.sensitivity.find((s) => s.differenceMonths < 0);

  const highlightFindings = exec.qualitativeFindings
    .filter((f) => ["scenario_spread", "housing_pressure", "sensitivity"].includes(f.themeKey))
    .slice(0, 3);

  return (
    <section className={className} data-testid="brief-example-embed">
      <div className="rounded-xl border-2 border-gold/30 overflow-hidden bg-white shadow-lg">
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-200/80">
          <p className="text-xs font-medium text-amber-900 text-center">{SAMPLE_EXAMPLE_LABEL}</p>
        </div>

        <div className="px-5 py-4 border-b border-gold/15 bg-gradient-to-br from-primary via-[hsl(220_52%_22%)] to-[hsl(220_52%_16%)]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gold shrink-0" />
            <p className="text-[10px] uppercase tracking-widest text-gold/90 font-semibold">
              {RUNWAY_BRIEF_NAME} — sample
            </p>
          </div>
          <p className="text-sm sm:text-base text-white/95 leading-relaxed font-serif">{SAMPLE_EXAMPLE_FRAMING}</p>
        </div>

        <CardContent className="p-4 sm:p-6 space-y-6 bg-[hsl(40_30%_98%)]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="rounded-lg border border-gold/15 bg-white p-3">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">Statutory est.</p>
              <p className="text-lg font-bold text-primary tabular-nums">{formatGBP(packageData.estimate.statutoryRedundancy)}</p>
            </div>
            <div className="rounded-lg border border-gold/15 bg-white p-3">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">Package total</p>
              <p className="text-lg font-bold text-primary tabular-nums">{formatGBP(packageData.packageTotal)}</p>
            </div>
            <div className="rounded-lg border border-gold/15 bg-white p-3">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">Starting capital</p>
              <p className="text-lg font-bold text-primary tabular-nums">{formatGBP(dashboard.baseline.startingCapital)}</p>
            </div>
            <div className="rounded-lg border border-gold/15 bg-white p-3">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">Baseline runway</p>
              <p className="text-lg font-bold text-primary tabular-nums">{formatMonths(dashboard.baseline.monthsUntilDepletion)}</p>
            </div>
          </div>

          <RunwayBriefMetricGrid dashboard={dashboard} />

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-gold/15 bg-white p-3">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">Baseline</p>
              <p className="text-lg font-bold text-primary tabular-nums">
                {formatMonths(dashboard.baseline.monthsUntilDepletion)}
              </p>
            </div>
            <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-3">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">Slow case</p>
              <p className="text-lg font-bold text-amber-800 tabular-nums">
                {formatMonths(slowScenario?.monthsUntilDepletion ?? dashboard.baseline.monthsUntilDepletion)}
              </p>
            </div>
            <div className="rounded-lg border border-red-200/50 bg-red-50/40 p-3">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">Severe case</p>
              <p className="text-lg font-bold text-red-800/90 tabular-nums">
                {formatMonths(dashboard.severeCaseRunway)}
              </p>
            </div>
          </div>

          <BriefRunwayPathDashboard
            dashboard={dashboard}
            commentary={narrative.runwayRangeCommentary.summary}
          />

          <Card className="border border-gold/20 bg-white rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gold/10 bg-primary/5">
              <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">What stands out</p>
              <p className="text-sm text-foreground/85 leading-relaxed mt-1">{exec.narrativeSummary}</p>
            </div>
            <CardContent className="p-4 space-y-3">
              {highlightFindings.map((f) => (
                <div key={f.themeKey} className="rounded-lg border border-gold/10 bg-[hsl(40_30%_98%)] p-3">
                  <p className="text-xs font-semibold text-primary mb-1">
                    {THEME_LABELS[f.themeKey] ?? f.themeKey.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{f.observation}</p>
                </div>
              ))}

              {topNegativeSens && (
                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold text-[#1a3357] mb-1">Sensitivity — model scenario</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Under the sample assumptions,{" "}
                    <span className="font-medium">{topNegativeSens.factor.toLowerCase()}</span> changes baseline runway
                    by {formatMonths(Math.abs(topNegativeSens.differenceMonths))} in this model. This is a stress test,
                    not a prediction.
                  </p>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground leading-relaxed border-t border-gold/10 pt-3">
                {narrative.disclaimer}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link href={primaryHref} className="flex-1">
              <Button className="btn-gold w-full" data-testid="button-brief-example-primary-cta">
                {primaryLabel}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            {showFullExampleLink && (
              <Link href="/brief-example" className="flex-1">
                <Button variant="outline" className="w-full" data-testid="button-brief-example-full">
                  View full example brief
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </div>
    </section>
  );
}
