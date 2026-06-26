import { useState, useMemo } from "react";
import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Briefcase,
  Columns3,
  FileText,
  Layers,
  ListChecks,
  Lock,
  Scale,
  Sliders,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RedundancyPackageDashboard } from "@/components/package-dashboard/RedundancyPackageDashboard";
import { CapitalPathDashboard } from "@/components/dashboards/capital-path-dashboard";
import { LandingMaximiserFeatureCallout } from "@/components/landing/LandingMaximiserFeatureCallout";
import { RunwayConsole, DEMO_CONSOLE_SCENARIOS, DEMO_COMPOSITION } from "@/components/runway-console";
import { EXAMPLE_RUNWAY_INPUTS } from "@/lib/private-runway-brief/exampleInputs";
import {
  getSampleBriefDashboard,
  SAMPLE_EXAMPLE_LABEL,
  SAMPLE_PRIVATE_RUNWAY_NARRATIVE,
} from "@/lib/private-runway-brief/sampleExample";
import { computeRunway, computeRedundancyEstimate, formatGBP, formatMonths } from "@/lib/engine";
import { chartTheme } from "@/lib/chart-theme";
import {
  PRODUCT_COPY,
  PRIVACY_COPY,
  RUNWAY_BRIEF_NAME,
  RUNWAY_REPORT_FULL,
  RUNWAY_REPORT_PRICE_GBP,
} from "@shared/product";

type ExplorerTabId = "package" | "capital" | "brief" | "preview";

type ExplorerModule = {
  id: ExplorerTabId;
  label: string;
  icon: LucideIcon;
};

const UNLOCKED_MODULES: ExplorerModule[] = [
  { id: "package", label: "Package", icon: Briefcase },
  { id: "capital", label: "Capital path", icon: TrendingDown },
  { id: "brief", label: "Private Brief", icon: BookOpen },
  { id: "preview", label: "Free preview", icon: Sparkles },
];

const LOCKED_MODULES: { label: string; icon: LucideIcon }[] = [
  { label: "Entitlement estimate", icon: Scale },
  { label: "Payout to runway", icon: Layers },
  { label: "Offer comparison", icon: TrendingDown },
  { label: "Tax-sensitive", icon: FileText },
  { label: "Final pay checklist", icon: ListChecks },
  { label: "Income recovery", icon: Columns3 },
  { label: "Pressure points", icon: AlertTriangle },
  { label: "Expense sensitivity", icon: Sliders },
  { label: "Stress cases", icon: Activity },
];

function BriefExecutiveStrip() {
  const dashboard = getSampleBriefDashboard();
  const exec = SAMPLE_PRIVATE_RUNWAY_NARRATIVE.executiveSummary;
  const slowScenario = dashboard.scenarios.find((s) => s.scenarioKey === "slow_recovery");

  return (
    <div className="space-y-4" data-testid="explorer-brief-strip">
      <div className="rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2">
        <p className="text-[11px] font-medium text-amber-900 text-center">{SAMPLE_EXAMPLE_LABEL}</p>
      </div>

      <div className="rounded-xl border border-gold/20 bg-white p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">{RUNWAY_BRIEF_NAME}</p>
        <p className="font-serif text-base sm:text-lg text-foreground leading-snug">{exec.headline}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-gold/15 bg-white p-3 text-center">
          <p className="text-[10px] uppercase text-muted-foreground mb-1">Baseline</p>
          <p className="text-lg font-bold text-primary tabular-nums">
            {formatMonths(dashboard.baseline.monthsUntilDepletion)}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-3 text-center">
          <p className="text-[10px] uppercase text-muted-foreground mb-1">Slow case</p>
          <p className="text-lg font-bold text-amber-800 tabular-nums">
            {formatMonths(slowScenario?.monthsUntilDepletion ?? dashboard.baseline.monthsUntilDepletion)}
          </p>
        </div>
        <div className="rounded-lg border border-red-200/50 bg-red-50/40 p-3 text-center">
          <p className="text-[10px] uppercase text-muted-foreground mb-1">Severe case</p>
          <p className="text-lg font-bold text-red-800/90 tabular-nums">
            {formatMonths(dashboard.severeCaseRunway)}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Full narrative, playbooks and export unlock with your figures.
      </p>

      <Link href="/brief-example">
        <Button variant="outline" size="sm">
          Read example brief
        </Button>
      </Link>
    </div>
  );
}

function ExplorerPanel({ tab }: { tab: ExplorerTabId }) {
  const result = useMemo(() => computeRunway(EXAMPLE_RUNWAY_INPUTS), []);
  const composition = useMemo(() => {
    const est = computeRedundancyEstimate(EXAMPLE_RUNWAY_INPUTS.redundancyPackage);
    const redundancyTotal =
      EXAMPLE_RUNWAY_INPUTS.redundancyPackage.useManualOverride &&
      EXAMPLE_RUNWAY_INPUTS.redundancyPackage.manualOverrideAmount > 0
        ? EXAMPLE_RUNWAY_INPUTS.redundancyPackage.manualOverrideAmount
        : est.totalEstimated;
    return [
      { label: "Cash savings", value: EXAMPLE_RUNWAY_INPUTS.cashSavings, color: chartTheme.color.cash },
      { label: "Liquid investments", value: EXAMPLE_RUNWAY_INPUTS.liquidInvestments, color: chartTheme.color.investments },
      { label: "Redundancy package", value: redundancyTotal, color: chartTheme.color.redundancy },
      {
        label: "Other one-off",
        value: EXAMPLE_RUNWAY_INPUTS.otherOneOffIncome + (EXAMPLE_RUNWAY_INPUTS.unpaidWages ?? 0),
        color: chartTheme.color.s4,
      },
    ].filter((c) => c.value > 0);
  }, []);

  switch (tab) {
    case "package":
      return <RedundancyPackageDashboard inputs={EXAMPLE_RUNWAY_INPUTS} />;
    case "capital":
      return <CapitalPathDashboard result={result} composition={composition} />;
    case "brief":
      return <BriefExecutiveStrip />;
    case "preview":
      return (
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-primary via-[hsl(220_52%_22%)] to-[hsl(220_52%_16%)] text-white px-5 py-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
                Free preview
              </span>
            </div>
            <p className="text-sm text-white/70 mb-4 max-w-lg">
              Statutory estimate, baseline runway and the Runway Command Console — before you unlock the full report.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Runway", value: formatMonths(result.monthsUntilDepletion) },
                { label: "Starting capital", value: formatGBP(result.startingCapital) },
                { label: "Monthly burn", value: formatGBP(result.monthlyBurn) },
                { label: "RRI score", value: `${result.stabilityScore}/100` },
              ].map((m) => (
                <div key={m.label} className="bg-white rounded-lg border border-slate-200 px-3 py-2.5 text-center">
                  <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-0.5">{m.label}</p>
                  <p className="text-sm font-bold text-[#1a3357] tabular-nums">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
          <RunwayConsole
            scenarios={DEMO_CONSOLE_SCENARIOS}
            composition={DEMO_COMPOSITION}
            chromeCaption="Runway Command Console"
            footerText="Illustrative example · your report uses the figures you enter"
            hideStress={false}
            testId="landing-explorer-preview-console"
          />
        </div>
      );
    default:
      return null;
  }
}

export function LandingReportExplorer() {
  const [tab, setTab] = useState<ExplorerTabId>("package");

  return (
    <div className="w-full" data-testid="landing-report-explorer">
      <LandingMaximiserFeatureCallout />

      <div className="mb-4 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-center lg:text-left">
        <p className="text-sm font-semibold text-primary mb-1">Interactive sample dashboards</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="lg:hidden">Tap a tab below to switch views. Scroll inside each dashboard to explore charts and line items.</span>
          <span className="hidden lg:inline">Select a module on the left to switch views. Each dashboard is live — scroll and explore the sample data.</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <nav
          className="lg:w-52 shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1"
          aria-label="Report modules"
        >
          {UNLOCKED_MODULES.map((mod) => {
            const active = tab === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setTab(mod.id)}
                className={`inline-flex items-center gap-2 rounded-full lg:rounded-lg px-3 py-2 text-xs font-semibold border transition-all shrink-0 lg:w-full ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
                data-testid={`explorer-tab-${mod.id}`}
              >
                <mod.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{mod.label}</span>
              </button>
            );
          })}

          <div className="hidden lg:block border-t border-border my-2" />
          <p className="hidden lg:block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-1 mb-1">
            +{LOCKED_MODULES.length} more in full report
          </p>

          {LOCKED_MODULES.map((mod) => (
            <div
              key={mod.label}
              className="hidden lg:flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground/70 border border-dashed border-border bg-muted/30"
            >
              <Lock className="w-3 h-3 shrink-0 text-gold" />
              <mod.icon className="w-3 h-3 shrink-0 opacity-50" />
              <span className="leading-tight">{mod.label}</span>
            </div>
          ))}

          <div className="lg:hidden w-full min-w-[220px] shrink-0 rounded-xl border border-gold/30 bg-gold/5 px-3 py-3 mt-1">
            <p className="text-xs font-semibold text-primary">Full private report</p>
            <p className="text-[10px] text-muted-foreground mb-2">£{RUNWAY_REPORT_PRICE_GBP} one-off · 6 months access</p>
            <Link href="/wizard">
              <Button size="sm" className="btn-gold w-full whitespace-normal h-auto min-h-9 py-2">
                Unlock full report
              </Button>
            </Link>
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-gold/20 bg-card p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">
                  {RUNWAY_REPORT_FULL}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {tab === "package" && "Package completeness, line items and gaps to verify"}
                  {tab === "capital" && "How starting capital depletes month by month"}
                  {tab === "brief" && `${RUNWAY_BRIEF_NAME} — executive summary strip`}
                  {tab === "preview" && "What you get free before unlock"}
                </p>
              </div>
              <span className="rounded-full border border-emerald-300/50 bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-800">
                Tap &amp; scroll to explore
              </span>
            </div>

            <ExplorerPanel tab={tab} />
          </div>

          <p className="mt-3 text-[11px] text-center text-muted-foreground lg:hidden">
            Swipe the tabs above to compare modules · scroll inside the dashboard
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/unlock">
          <Button className="btn-gold rounded-full whitespace-normal h-auto min-h-10 py-3 px-6">
            Unlock your full report
            <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
          </Button>
        </Link>
        <Link href="/wizard">
          <Button variant="outline" className="rounded-full">
            {PRODUCT_COPY.buildCta}
          </Button>
        </Link>
      </div>

      <p className="text-[10px] text-center text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
        Illustrative sample dashboards. {PRIVACY_COPY.modellingLocal}
      </p>
    </div>
  );
}
