import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  ArrowLeft,
  TrendingDown,
  Sliders,
  FileText,
  Download,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { useWizardStore } from "@/lib/wizardStore";
import {
  computeRunway,
  computeScenarios,
  computeSpendingImpact,
  computeSensitivity,
  computeEssentialOnlyComparison,
  computeMortgageSensitivity,
  computeProjectionRange,
  computeVoluntaryRedundancyComparison,
  formatGBP,
  formatMonths,
} from "@/lib/engine";
import { ukBenchmarks, getSavingsPosition, getSavingsPositionLabel } from "@/lib/ukBenchmarks";
import type { RunwayResult } from "@shared/schema";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Logo } from "@/components/Logo";
import { RriGauge } from "@/components/rri-gauge";
import { ScenarioLeaderboard } from "@/components/scenario-leaderboard";
import { RunwayConsole, buildRunwayConsoleScenarios } from "@/components/runway-console";
import { chartTheme } from "@/lib/chart-theme";
import { CapitalPathDashboard } from "@/components/dashboards/capital-path-dashboard";
import { IncomeRecoveryDashboard } from "@/components/dashboards/income-recovery-dashboard";
import { PressurePointsDashboard } from "@/components/dashboards/pressure-points-dashboard";
import { ExpenseSensitivityDashboard } from "@/components/dashboards/expense-sensitivity-dashboard";
import { StressCasesDashboard } from "@/components/dashboards/stress-cases-dashboard";
import { AssumptionsDashboard } from "@/components/dashboards/assumptions-dashboard";
import { AccessGate } from "@/components/access-gate";
import { useAccess } from "@/hooks/use-access";
import { getSessionToken } from "@/lib/sessionToken";
import { apiRequest } from "@/lib/queryClient";
import { PrivateRunwayBriefPanel } from "@/components/private-runway-brief/private-runway-brief-panel";
import { RedundancyPackageDashboard } from "@/components/package-dashboard/RedundancyPackageDashboard";
import { StatutoryEntitlementEstimateDashboard } from "@/components/package-dashboard/StatutoryEntitlementEstimateDashboard";
import { PackageToRunwayBridge } from "@/components/package-dashboard/PackageToRunwayBridge";
import { RedundancyOfferComparisonDashboard } from "@/components/package-dashboard/RedundancyOfferComparisonDashboard";
import { TaxSensitiveComponentsDashboard } from "@/components/package-dashboard/TaxSensitiveComponentsDashboard";
import { PackageChecksDashboard } from "@/components/package-dashboard/PackageChecksDashboard";
import { usePrivateRunwayBrief } from "@/hooks/use-private-runway-brief";
import { formatBriefPlainText } from "@/lib/private-runway-brief/formatBriefPlainText";
import { triggerReportPdfDownload } from "@/lib/report/triggerReportPdf";
import { RunwayReportBrand } from "@/components/RunwayReportBrand";
import { ImprovePositionHub } from "@/components/position-enhancement/ImprovePositionHub";
import { buildMaximiserInsights } from "@/lib/position-enhancement/buildMaximiserInsights";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import type { RunwayInputs } from "@shared/schema";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { COMMAND_CENTRE_NAME, RUNWAY_REPORT_FULL, RUNWAY_REPORT_PRICE_GBP, RUNWAY_REPORT_SEO } from "@shared/product";

function StabilityBadge({ band, score }: { band: RunwayResult["stabilityBand"]; score: number }) {
  const variant = band === "Stable" ? "default" : band === "Watch" ? "secondary" : "destructive";
  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant} data-testid="badge-stability">{band}</Badge>
      <span className="text-sm text-muted-foreground" data-testid="text-stability-score">{score}/100</span>
    </div>
  );
}

type PackageDashboardData = ReturnType<typeof buildPackageDashboardData>;
type MaximiserInsightsData = ReturnType<typeof buildMaximiserInsights>;

function ExecutiveDecisionPanel({
  result,
  packageData,
  maximiserInsights,
  housingPercent,
  onOpenTab,
}: {
  result: RunwayResult;
  packageData: PackageDashboardData;
  maximiserInsights: MaximiserInsightsData;
  housingPercent: number;
  onOpenTab: (tab: string) => void;
}) {
  const topOpportunity = maximiserInsights.rankedOpportunities[0];
  const weakItems = packageData.checklist.filter((item) => item.status !== "entered" && item.status !== "not_applicable");
  const firstMilestone = result.milestones[0];
  const pressureLine = firstMilestone
    ? `First pressure marker: month ${firstMilestone.month} — ${firstMilestone.description}`
    : "No modelled capital threshold events within the projection period.";
  const firstQuestion = weakItems[0]
    ? `Ask HR/payroll to confirm: ${weakItems[0].label.toLowerCase()}.`
    : "Ask HR/payroll for the written package breakdown before relying on the total.";

  return (
    <Card className="border-gold/35 bg-gold/5" data-testid="executive-decision-panel">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-serif text-xl">What this report suggests you check first</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              A decision layer from your package assumptions, runway result and verification gaps.
            </p>
          </div>
          <Badge variant="outline" className="bg-white/70 border-gold/40 text-primary">
            Executive readout
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border bg-white/80 p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Package check</p>
            <p className="text-sm font-semibold text-primary">
              {topOpportunity ? topOpportunity.label : "Written package breakdown"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {topOpportunity?.summary ??
                "Your model has the core package lines mapped. The next useful step is verifying the written breakdown against HR/payroll."}
            </p>
          </div>
          <div className="rounded-xl border bg-white/80 p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Runway readout</p>
            <p className="text-sm font-semibold text-primary">
              {formatMonths(result.monthsUntilDepletion)} baseline runway
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Monthly burn is {formatGBP(result.monthlyBurn)}. Housing is {housingPercent}% of essential costs under these assumptions.
            </p>
          </div>
          <div className="rounded-xl border bg-white/80 p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Pressure point</p>
            <p className="text-sm font-semibold text-primary">{result.stabilityBand} · {result.stabilityScore}/100</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{pressureLine}</p>
          </div>
          <div className="rounded-xl border bg-white/80 p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">First question to take forward</p>
            <p className="text-sm font-semibold text-primary">{firstQuestion}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              This is a preparation prompt, not legal or employment advice.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="btn-gold" onClick={() => document.getElementById("improve-position-hub")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            Open maximiser
          </Button>
          <Button size="sm" variant="outline" onClick={() => onOpenTab("package")}>
            Review package breakdown
          </Button>
          <Button size="sm" variant="outline" onClick={() => onOpenTab("brief")}>
            Read plain-English brief
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PackageScenarioNarrative({ insights }: { insights: MaximiserInsightsData }) {
  const statutory = insights.scenarioLadder.find((s) => s.scenarioKey === "statutory_only");
  const current = insights.scenarioLadder.find((s) => s.scenarioKey === "current_entered");
  const best = insights.scenarioLadder
    .filter((s) => s.packageTotal >= insights.currentPackageTotal)
    .slice(-1)[0];

  return (
    <Card data-testid="package-scenario-narrative">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg">Package scenarios: pounds into runway months</CardTitle>
        <p className="text-xs text-muted-foreground">
          Compare the statutory baseline, your current modelled package and the strongest higher-package scenario in this report.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "Statutory baseline", row: statutory },
            { label: "Current package model", row: current },
            { label: "Higher-package scenario", row: best },
          ].map(({ label, row }) => (
            <div key={label} className="rounded-xl border bg-muted/35 p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
              <p className="text-xl font-bold text-primary tabular-nums">{formatGBP(row?.packageTotal ?? 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatMonths(row?.baselineRunwayMonths ?? insights.currentRunwayMonths)} baseline runway
              </p>
              {row && row.deltaRunwayVsCurrent !== 0 && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  {row.deltaRunwayVsCurrent > 0 ? "+" : ""}
                  {formatMonths(row.deltaRunwayVsCurrent)} vs current model
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The purpose is not to predict what you will receive. It shows why each package line matters: changes to redundancy, notice, holiday or enhanced pay flow directly into starting capital and the number of months the money may cover.
        </p>
      </CardContent>
    </Card>
  );
}

function BeforeYouSignChecklist({ packageData }: { packageData: PackageDashboardData }) {
  const priorityItems = packageData.checklist
    .filter((item) => item.status !== "not_applicable")
    .slice(0, 6);

  return (
    <Card data-testid="before-you-sign-checklist">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg">Before you sign: package verification checklist</CardTitle>
        <p className="text-xs text-muted-foreground">
          Use these prompts to request clarity before relying on the package total.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {priorityItems.map((item) => (
            <div key={item.itemKey} className="rounded-lg border bg-card p-3">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.whyItMatters}</p>
                  <p className="text-[10px] text-primary mt-2 leading-relaxed">Where to check: {item.whereToCheck}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
          <p className="text-xs font-semibold text-amber-950 mb-1">Suggested wording</p>
          <p className="text-xs text-amber-900 leading-relaxed">
            Please confirm how my redundancy package has been calculated, including statutory redundancy, notice/PILON, accrued holiday, enhanced terms, deductions, unpaid wages or bonuses, and expected payment timing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ThisWeekActionPlan({
  result,
  packageData,
}: {
  result: RunwayResult;
  packageData: PackageDashboardData;
}) {
  const missingCount = packageData.checklist.filter((item) => item.status === "not_entered" || item.status === "verify").length;
  const pressureAction =
    result.monthsUntilDepletion <= 6
      ? "Review essential costs and any flexible spend assumptions this week, because the baseline runway is relatively short."
      : "Keep the current spending assumptions under review and use the slow scenario as the planning reference.";

  return (
    <Card data-testid="this-week-action-plan">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg">What this means for you this week</CardTitle>
        <p className="text-xs text-muted-foreground">Practical prompts from the model. Preparation support only, not advice.</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/40 border p-3">
            <p className="text-xs font-semibold text-primary mb-1">1. Get the package in writing</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {missingCount > 0
                ? `${missingCount} package item${missingCount === 1 ? "" : "s"} need verification in your model.`
                : "The main package items are mapped; verify the written breakdown matches them."}
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 border p-3">
            <p className="text-xs font-semibold text-primary mb-1">2. Stress-test the runway</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{pressureAction}</p>
          </div>
          <div className="rounded-lg bg-muted/40 border p-3">
            <p className="text-xs font-semibold text-primary mb-1">3. Prepare the conversation</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Take the checklist questions into HR, payroll or consultation conversations before signing or relying on the figure.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResultsPage() {
  return (
    <AccessGate>
      <ResultsPageContent />
    </AccessGate>
  );
}

export function ResultsPageContent({
  isDemo = false,
  overrideInputs,
  demoBriefNarrative,
}: {
  isDemo?: boolean;
  overrideInputs?: RunwayInputs;
  demoBriefNarrative?: PrivateRunwayBriefNarrative;
} = {}) {
  const [, navigate] = useLocation();
  const { inputs: wizardInputs } = useWizardStore();
  const inputs = overrideInputs ?? wizardInputs;
  const { hasAccess: paidAccess } = useAccess();
  const hasAccess = isDemo || paidAccess;
  const { narrative: liveNarrative } = usePrivateRunwayBrief(inputs);
  const narrative = isDemo ? demoBriefNarrative : liveNarrative;
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("package");

  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const scenarios = useMemo(() => computeScenarios(inputs), [inputs]);
  const spendingImpacts = useMemo(() => computeSpendingImpact(inputs), [inputs]);
  const sensitivityResults = useMemo(() => computeSensitivity(inputs), [inputs]);
  const packageData = useMemo(() => buildPackageDashboardData(inputs), [inputs]);
  const maximiserInsights = useMemo(() => buildMaximiserInsights(inputs), [inputs]);
  const essentialComparison = useMemo(() => computeEssentialOnlyComparison(inputs), [inputs]);
  const mortgageSensitivity = useMemo(
    () => (inputs.mortgageOrRent > 0 ? computeMortgageSensitivity(inputs) : []),
    [inputs]
  );
  const projectionRange = useMemo(() => computeProjectionRange(inputs), [inputs]);
  const consoleScenarios = useMemo(() => buildRunwayConsoleScenarios(scenarios), [scenarios]);
  const composition = useMemo(() => {
    return [
      { label: "Cash savings", value: inputs.cashSavings, color: chartTheme.color.cash },
      { label: "Liquid investments", value: inputs.liquidInvestments, color: chartTheme.color.investments },
      { label: "Redundancy package", value: packageData.packageTotal, color: chartTheme.color.redundancy },
      { label: "Other one-off", value: inputs.otherOneOffIncome + (inputs.unpaidWages ?? 0), color: chartTheme.color.s4 },
    ].filter((c) => c.value > 0);
  }, [inputs, packageData.packageTotal]);
  const savingsPosition = useMemo(() => getSavingsPosition(result.startingCapital), [result.startingCapital]);
  const savingsLabel = useMemo(() => getSavingsPositionLabel(savingsPosition), [savingsPosition]);
  const housingPercent = useMemo(() => {
    return result.essentialExpenses > 0 ? Math.round((inputs.mortgageOrRent / result.essentialExpenses) * 100) : 0;
  }, [inputs.mortgageOrRent, result.essentialExpenses]);
  const showStrongerResetCta =
    result.stabilityBand === "High Pressure" ||
    result.monthsUntilDepletion <= 3 ||
    housingPercent > ukBenchmarks.housingBurden.stressReferenceThresholdPercent ||
    inputs.context.confidenceLevel === "under_pressure";

  const showVRComparison = inputs.context.employmentStatus === "voluntary_redundancy" && (inputs.voluntaryRedundancyAmount ?? 0) > 0;
  const vrComparison = useMemo(
    () => (showVRComparison ? computeVoluntaryRedundancyComparison(inputs) : null),
    [inputs, showVRComparison]
  );

  const handleCopySummary = () => {
    navigator.clipboard.writeText(buildSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buildSummaryText = useCallback(() => {
    const lines = [
      "RedundancyCalculatorUK — Redundancy Runway Report Summary",
      "=======================================================",
      `Date: ${new Date().toLocaleDateString("en-GB")}`,
      "",
      "ASSUMPTIONS:",
      `  Starting Capital: ${formatGBP(result.startingCapital)}`,
      `  Essential Expenses: ${formatGBP(result.essentialExpenses)}/mo`,
      `  Non-Essential Expenses: ${formatGBP(result.nonEssentialExpenses)}/mo`,
      `  Total Expenses: ${formatGBP(result.totalExpenses)}/mo`,
      `  Monthly Net Burn: ${formatGBP(result.monthlyBurn)}`,
      "",
      "PROJECTION:",
      `  Months Until Depletion: ${formatMonths(result.monthsUntilDepletion)}`,
      `  Stability: ${result.stabilityBand} (${result.stabilityScore}/100)`,
      "",
      "CAPITAL AT KEY POINTS:",
      `  3 months: ${formatGBP(result.capitalAfter3Months)}`,
      `  6 months: ${formatGBP(result.capitalAfter6Months)}`,
      `  12 months: ${formatGBP(result.capitalAfter12Months)}`,
      "",
      "CAPITAL THRESHOLD EVENTS:",
      ...(result.milestones.length > 0
        ? result.milestones.map(m => `  Month ${m.month}: ${m.description} [${m.severity}]`)
        : ["  No threshold events within projection period."]),
      "",
      "INCOME RECOVERY SCENARIOS:",
      ...scenarios.map(s => `  ${s.name}: ${formatMonths(s.result.monthsUntilDepletion)}`),
      "",
      "Illustrative projection only. Not financial advice.",
    ];
    if (narrative) {
      lines.push("", "═".repeat(55), "", formatBriefPlainText(inputs, narrative));
    }
    return lines.join("\n");
  }, [result, scenarios, narrative, inputs]);

  const handleDownloadReport = () => {
    triggerReportPdfDownload();
  };

  const handleOpenReportTab = useCallback((tab: string) => {
    if (tab === "maximise") {
      document.getElementById("improve-position-hub")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const groupedTab =
      ["package", "entitlement", "bridge", "offer", "tax", "checklist"].includes(tab)
        ? "package"
        : ["trajectory", "scenarios", "milestones", "runway"].includes(tab)
          ? "runway"
          : ["spending", "stress"].includes(tab)
            ? "stress"
            : tab === "supplementary"
              ? "assumptions"
              : tab;

    setActiveTab(groupedTab);
    requestAnimationFrame(() => {
      document.getElementById("report-dashboard-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    if (!hasAccess || isDemo) return;
    apiRequest("POST", "/api/calculations", {
      sessionToken: getSessionToken(),
      inputs,
    }).catch(() => {});
  }, [hasAccess, inputs]);

  return (
    <>
      {!isDemo && (
      <Helmet>
        <title>Your {RUNWAY_REPORT_FULL} — RedundancyCalculatorUK</title>
        <meta name="description" content="Your full private redundancy runway report — capital trajectory, income recovery scenarios, mortgage sensitivity, expense analysis and stress testing." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.redundancycalculatoruk.co.uk/results" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content={`Your ${RUNWAY_REPORT_FULL} — RedundancyCalculatorUK`} />
        <meta property="og:description" content="Your full private redundancy runway report — capital trajectory, income recovery scenarios, mortgage sensitivity, expense analysis and stress testing." />
        <meta property="og:url" content="https://www.redundancycalculatoruk.co.uk/results" />
        <meta property="og:image" content="https://www.redundancycalculatoruk.co.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Your ${RUNWAY_REPORT_FULL} — RedundancyCalculatorUK`} />
        <meta name="twitter:description" content="Your full private redundancy runway report — capital trajectory, income recovery scenarios, mortgage sensitivity, expense analysis and stress testing." />
        <meta name="twitter:image" content="https://www.redundancycalculatoruk.co.uk/og-image.png" />
      </Helmet>
      )}
    <div className="min-h-screen bg-background" data-testid="page-results">
      {!isDemo && <DisclaimerBanner />}

      {!isDemo && (
      <header className="border-b px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/wizard")}
              data-testid="button-back-wizard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadReport}
              data-testid="button-download-report"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              data-testid="button-copy-summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              {copied ? "Copied" : "Copy Summary"}
            </Button>
          </div>
        </div>
      </header>
      )}

      {isDemo && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 print:hidden mx-4 sm:mx-8 mt-4 max-w-6xl" data-testid="banner-report-demo">
          <p className="font-medium">Sample report preview</p>
          <p className="text-xs text-amber-900/80 mt-1">
            Illustrative baseline figures and report structure only — position playbooks, runway dashboards and the full brief unlock with your figures (£{RUNWAY_REPORT_PRICE_GBP}).
          </p>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Navy hero summary — white workspace */}
        <section
          className="rounded-2xl bg-gradient-to-br from-primary via-[hsl(220_52%_22%)] to-[hsl(220_52%_16%)] text-white overflow-hidden"
          data-testid="card-executive-summary"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 px-6 py-6 border-b border-white/10">
            <div className="space-y-4 flex-1">
              <RunwayReportBrand variant="light" context="report" showUrl />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{COMMAND_CENTRE_NAME}</p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2" data-testid="text-page-title">
                  Your {RUNWAY_REPORT_SEO}
                </h1>
                <p className="text-sm text-white/60 max-w-lg">
                  Illustrative projection under the assumptions entered. Not financial advice.
                </p>
              </div>
            </div>
            <RriGauge score={result.stabilityScore} size={110} label="RRI" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {[
              { label: "Estimated runway", value: formatMonths(result.monthsUntilDepletion), id: "exec-runway" },
              { label: "Starting capital", value: formatGBP(result.startingCapital), id: "exec-capital" },
              { label: "Net monthly burn", value: formatGBP(result.monthlyBurn), id: "exec-burn" },
              { label: "Total expenses/mo", value: formatGBP(result.totalExpenses), id: "exec-expenses" },
            ].map((m) => (
              <div key={m.id} className="bg-white/5 px-5 py-4 backdrop-blur-sm" data-testid={m.id}>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{m.label}</p>
                <p className="text-xl sm:text-2xl font-bold font-display text-white tabular-nums">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="px-6 py-5 bg-white/5">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Projection range (historical percentiles)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[projectionRange.fast, projectionRange.typical, projectionRange.slow].map((s, i) => (
                <div key={i} className="rounded-xl bg-white/8 border border-white/10 px-4 py-3 text-center">
                  <p className="text-[10px] text-white/50">{s.percentileLabel}</p>
                  <p className="font-semibold text-white text-lg tabular-nums">{formatMonths(s.runwayMonths)}</p>
                  <p className="text-[10px] text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <StabilityBadge band={result.stabilityBand} score={result.stabilityScore} />
              <p className="text-xs text-white/50">Stability classification under these assumptions</p>
            </div>
          </div>
        </section>

        <ExecutiveDecisionPanel
          result={result}
          packageData={packageData}
          maximiserInsights={maximiserInsights}
          housingPercent={housingPercent}
          onOpenTab={handleOpenReportTab}
        />

        <div id="improve-position-hub">
          <ImprovePositionHub inputs={inputs} onOpenTab={handleOpenReportTab} demoMode={isDemo} />
        </div>

        <PackageScenarioNarrative insights={maximiserInsights} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BeforeYouSignChecklist packageData={packageData} />
          <ThisWeekActionPlan result={result} packageData={packageData} />
        </div>

        {/* Sticky scenario chips */}
        <div className="sticky top-[57px] z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 py-2 bg-background/95 backdrop-blur border-b">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {scenarios.map((s, i) => (
              <span
                key={i}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border bg-card text-foreground border-border"
              >
                <span className="w-2 h-2 rounded-full" style={{ background: [chartTheme.color.s1, chartTheme.color.s2, chartTheme.color.s3, chartTheme.color.s4][i] }} />
                {s.name}: {formatMonths(s.result.monthsUntilDepletion)}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <ScenarioLeaderboard scenarios={scenarios} title="Income recovery paths" />
        </div>

        {result.stabilityExplanation.factors.length > 0 && (
          <div className="mb-8" data-testid="card-stability-factors">
            <p className="text-sm font-medium mb-3">Runway Resilience factors</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.stabilityExplanation.factors.map((factor, i) => (
                <Card key={i} className="border-l-4 border-l-primary/40">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground leading-relaxed" data-testid={`text-factor-${i}`}>{factor}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 hidden sm:block">
          {consoleScenarios.length > 0 && composition.length > 0 && (
            <RunwayConsole
              scenarios={consoleScenarios}
              composition={composition}
              chromeCaption="Runway Command Console"
            />
          )}
        </div>

        <Card className="mb-8" data-testid="card-projection-range">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg font-semibold">Projection Range</CardTitle>
            <p className="text-xs text-muted-foreground">Modelled using historical reemployment percentiles.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[projectionRange.fast, projectionRange.typical, projectionRange.slow].map((scenario, i) => (
                <div key={i} className="rounded-md bg-muted/50 p-4 space-y-2" data-testid={`projection-scenario-${i}`}>
                  <Badge variant="outline" className="text-xs">{scenario.percentileLabel}</Badge>
                  <p className="text-sm font-medium">{scenario.label}</p>
                  <p className="text-2xl font-bold" data-testid={`text-range-runway-${i}`}>
                    {formatMonths(scenario.runwayMonths)}
                  </p>
                  {scenario.depletionMonth !== null && (
                    <p className="text-xs text-muted-foreground">
                      Capital depletion: Month {scenario.depletionMonth}
                    </p>
                  )}
                  {scenario.recoveryMonth !== null && (
                    <p className="text-xs text-muted-foreground">
                      Capital recovery: Month {scenario.recoveryMonth}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/70 italic mt-4">
              These projections are derived from historical labour market percentiles applied to your assumptions. They do not predict individual outcomes.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card data-testid="card-savings-position">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs font-medium mb-1">Starting Capital Position (UK Comparison)</p>
              <p className="text-xs text-muted-foreground" data-testid="text-savings-position">{savingsLabel}</p>
            </CardContent>
          </Card>
          {inputs.mortgageOrRent > 0 && (
            <Card data-testid="card-housing-exposure">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs font-medium mb-1">Housing Exposure Context</p>
                <p className="text-xs text-muted-foreground" data-testid="text-housing-exposure">
                  Your housing costs represent {housingPercent}% of essential expenditure.
                </p>
                <p className="text-xs text-muted-foreground">
                  Reference housing burden benchmark: {ukBenchmarks.housingBurden.typicalBurdenPercent}% (UK average).
                </p>
                {housingPercent > ukBenchmarks.housingBurden.stressReferenceThresholdPercent && (
                  <p className="text-xs text-muted-foreground">
                    Your housing exposure is above the model reference threshold ({ukBenchmarks.housingBurden.stressReferenceThresholdPercent}%).
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" id="report-dashboard-tabs">
          <div className="rounded-xl border bg-muted/30 p-2">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent w-full justify-start" data-testid="tabs-list">
              <TabsTrigger value="package" className="rounded-full text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-package">
                <Briefcase className="w-3 h-3 shrink-0" />
                Package
              </TabsTrigger>
              <TabsTrigger value="runway" className="rounded-full text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-runway">
                <TrendingDown className="w-3 h-3 shrink-0" />
                Runway
              </TabsTrigger>
              <TabsTrigger value="stress" className="rounded-full text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-stress">
                <Sliders className="w-3 h-3 shrink-0" />
                Stress tests
              </TabsTrigger>
              <TabsTrigger value="assumptions" className="rounded-full text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-assumptions">
                <FileText className="w-3 h-3 shrink-0" />
                Assumptions &amp; sources
              </TabsTrigger>
              <TabsTrigger value="brief" className="rounded-full text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-brief">
                <BookOpen className="w-3 h-3 shrink-0" />
                Private Brief
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="package" className="report-print-section">
            <div className="space-y-5">
              <RedundancyPackageDashboard inputs={inputs} />
              <StatutoryEntitlementEstimateDashboard inputs={inputs} />
              <PackageToRunwayBridge inputs={inputs} />
              <RedundancyOfferComparisonDashboard inputs={inputs} />
              <TaxSensitiveComponentsDashboard inputs={inputs} />
              <PackageChecksDashboard inputs={inputs} />
            </div>
          </TabsContent>

          <TabsContent value="runway" className="report-print-section">
            <div className="space-y-5">
              <CapitalPathDashboard result={result} composition={composition} />
              <IncomeRecoveryDashboard scenarios={scenarios} vrComparison={showVRComparison ? vrComparison : null} />
              <PressurePointsDashboard result={result} essentialComparison={essentialComparison} />
            </div>
          </TabsContent>

          <TabsContent value="stress" className="report-print-section">
            <div className="space-y-5">
              <StressCasesDashboard
                result={result}
                sensitivityResults={sensitivityResults}
                mortgageSensitivity={mortgageSensitivity}
                currentHousingCost={inputs.mortgageOrRent > 0 ? inputs.mortgageOrRent : undefined}
              />
              <ExpenseSensitivityDashboard spendingImpacts={spendingImpacts} />
            </div>
          </TabsContent>

          <TabsContent value="assumptions" className="report-print-section">
            <div className="space-y-5">
              <ThisWeekActionPlan result={result} packageData={packageData} />
              <AssumptionsDashboard
                inputs={inputs}
                startingCapital={result.startingCapital}
                savingsLabel={savingsLabel}
                housingPercent={housingPercent}
              />
            </div>
          </TabsContent>

          <TabsContent value="brief" className="report-print-section">
            <PrivateRunwayBriefPanel inputs={inputs} prefilledNarrative={isDemo ? demoBriefNarrative : undefined} demoMode={isDemo} />
          </TabsContent>
        </Tabs>

        {showStrongerResetCta ? (
          <Card className="border-gold/40 bg-gold/10 shadow-md" data-testid="card-reset-cta-urgent">
            <CardContent className="pt-6 pb-6">
              <p className="text-base font-semibold mb-1">Private written support for the next step.</p>
              <p className="text-sm text-muted-foreground mb-4 max-w-lg">
                Your result may raise practical next-step questions. Get a private written plan for the next 7 days.
              </p>
              <Button className="btn-gold" onClick={() => navigate("/redundancy-reset")} data-testid="button-reset-cta-urgent">
                Get my 7-day written reset
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card data-testid="card-reset-cta-standard">
            <CardContent className="pt-5 pb-5 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-muted-foreground max-w-md">
                Your report shows the package and runway picture. The 7-Day Redundancy Reset helps you turn it into a short written action plan.
              </p>
              <Button variant="outline" onClick={() => navigate("/redundancy-reset")} data-testid="button-reset-cta-standard">
                Turn this into a 7-day plan
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 pt-6 border-t text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Illustrative projection only. Based entirely on the assumptions you entered. This tool does not provide financial, employment, debt, or benefits advice.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Data sources: Office for National Statistics (Labour Market Statistics, Wealth & Assets Survey, Household Expenditure Data).
            Benchmark data last updated: {ukBenchmarks.meta.lastUpdated}.
          </p>
        </div>
      </main>
    </div>
    </>
  );
}
