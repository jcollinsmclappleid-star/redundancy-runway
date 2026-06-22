import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  Clock,
  Home,
  Info,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
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
import type { RunwayResult, MonthProjection } from "@shared/schema";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Logo } from "@/components/Logo";

function StabilityBadge({ band, score }: { band: RunwayResult["stabilityBand"]; score: number }) {
  const variant = band === "Stable" ? "default" : band === "Watch" ? "secondary" : "destructive";
  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant} data-testid="badge-stability">{band}</Badge>
      <span className="text-sm text-muted-foreground" data-testid="text-stability-score">{score}/100</span>
    </div>
  );
}

function CapitalTrajectoryChart({ projections }: { projections: MonthProjection[] }) {
  const maxMonth = projections.findIndex(p => p.capital <= 0);
  const displayMax = maxMonth > 0 ? Math.min(maxMonth + 3, 60) : 36;
  const data = projections.filter((_, i) => i <= displayMax);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="capitalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.15} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
        <XAxis
          dataKey="month"
          tickFormatter={(v) => `M${v}`}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
        />
        <YAxis
          tickFormatter={(v) => formatGBP(v)}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          width={70}
        />
        <RechartsTooltip
          formatter={(value: number) => [formatGBP(value), "Capital"]}
          labelFormatter={(label) => `Month ${label}`}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        />
        <Area
          type="monotone"
          dataKey="capital"
          stroke="hsl(var(--chart-1))"
          strokeWidth={3}
          fill="url(#capitalGradient)"
          name="Capital"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ScenarioOverlayChart({ scenarios }: { scenarios: ReturnType<typeof computeScenarios> }) {
  const maxMonths = Math.max(
    ...scenarios.map(s =>
      s.result.monthsUntilDepletion < 60 ? s.result.monthsUntilDepletion + 3 : 36
    )
  );
  const displayMax = Math.min(maxMonths, 60);

  const data = Array.from({ length: displayMax + 1 }, (_, month) => ({
    month,
    ...Object.fromEntries(
      scenarios.map((s, i) => [
        `scenario${i}`,
        s.result.projections[Math.min(month, s.result.projections.length - 1)]?.capital ?? 0,
      ])
    ),
  }));

  const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
        <XAxis
          dataKey="month"
          tickFormatter={(v) => `M${v}`}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
        />
        <YAxis
          tickFormatter={(v) => formatGBP(v)}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          width={70}
        />
        <RechartsTooltip
          formatter={(value: number, name: string) => {
            const idx = parseInt(name.replace("scenario", ""));
            return [formatGBP(value), scenarios[idx]?.name ?? name];
          }}
          labelFormatter={(label) => `Month ${label}`}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        />
        <Legend
          formatter={(value: string) => {
            const idx = parseInt(value.replace("scenario", ""));
            return scenarios[idx]?.name ?? value;
          }}
          wrapperStyle={{ fontSize: "12px" }}
        />
        {scenarios.map((_, i) => (
          <Line
            key={i}
            type="monotone"
            dataKey={`scenario${i}`}
            stroke={colors[i]}
            strokeWidth={3}
            dot={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function MonthlyDataTable({ projections }: { projections: MonthProjection[] }) {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const relevantMonths = projections.filter(p => p.month > 0);
  const displayMonths = showAll ? relevantMonths : relevantMonths.slice(0, 12);

  return (
    <Card data-testid="card-monthly-table">
      <CardHeader
        className="cursor-pointer flex flex-row items-center justify-between gap-2 pb-3"
        onClick={() => setExpanded(!expanded)}
        data-testid="button-toggle-monthly-table"
      >
        <CardTitle className="text-sm font-medium">Monthly Projection Data</CardTitle>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs" data-testid="table-monthly-data">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Month</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">Capital</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">Income</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">Expenses</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">Net Burn</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {displayMonths.map((p) => (
                  <tr
                    key={p.month}
                    className={`border-b last:border-0 ${p.capital <= 0 ? "text-destructive" : ""}`}
                    data-testid={`table-row-month-${p.month}`}
                  >
                    <td className="py-1.5 px-2 font-medium">{p.month}</td>
                    <td className="py-1.5 px-2 text-right">{formatGBP(p.capital)}</td>
                    <td className="py-1.5 px-2 text-right">{formatGBP(p.income)}</td>
                    <td className="py-1.5 px-2 text-right">{formatGBP(p.expenses)}</td>
                    <td className={`py-1.5 px-2 text-right ${p.netBurn > 0 ? "text-destructive" : "text-primary"}`}>
                      {p.netBurn > 0 ? `-${formatGBP(p.netBurn)}` : `+${formatGBP(Math.abs(p.netBurn))}`}
                    </td>
                    <td className="py-1.5 px-2 text-muted-foreground">
                      {p.milestones.length > 0 ? p.milestones.join(", ") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {relevantMonths.length > 12 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => setShowAll(!showAll)}
              data-testid="button-toggle-all-months"
            >
              {showAll ? "Show first 12 months" : `Show all ${relevantMonths.length} months`}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { inputs } = useWizardStore();
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const scenarios = useMemo(() => computeScenarios(inputs), [inputs]);
  const spendingImpacts = useMemo(() => computeSpendingImpact(inputs), [inputs]);
  const sensitivityResults = useMemo(() => computeSensitivity(inputs), [inputs]);
  const essentialComparison = useMemo(() => computeEssentialOnlyComparison(inputs), [inputs]);
  const mortgageSensitivity = useMemo(
    () => (inputs.mortgageOrRent > 0 ? computeMortgageSensitivity(inputs) : []),
    [inputs]
  );
  const projectionRange = useMemo(() => computeProjectionRange(inputs), [inputs]);
  const savingsPosition = useMemo(() => getSavingsPosition(result.startingCapital), [result.startingCapital]);
  const savingsLabel = useMemo(() => getSavingsPositionLabel(savingsPosition), [savingsPosition]);
  const housingPercent = useMemo(() => {
    return result.essentialExpenses > 0 ? Math.round((inputs.mortgageOrRent / result.essentialExpenses) * 100) : 0;
  }, [inputs.mortgageOrRent, result.essentialExpenses]);

  const showMortgageTab = inputs.mortgageOrRent > 0;
  const showVRComparison = inputs.context.employmentStatus === "voluntary_redundancy" && (inputs.voluntaryRedundancyAmount ?? 0) > 0;
  const vrComparison = useMemo(
    () => (showVRComparison ? computeVoluntaryRedundancyComparison(inputs) : null),
    [inputs, showVRComparison]
  );

  const handleCopySummary = () => {
    const lines = [
      "Capital Modelling — Projection Summary",
      "========================================",
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
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-results">
      <DisclaimerBanner />

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
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold mb-2" data-testid="text-page-title">
            Capital Projection Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Illustrative projection only. Based on the assumptions entered. This is not financial advice.
          </p>
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

        <Tabs defaultValue="trajectory" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1" data-testid="tabs-list">
            <TabsTrigger value="trajectory" data-testid="tab-trajectory">Capital Trajectory</TabsTrigger>
            <TabsTrigger value="scenarios" data-testid="tab-scenarios">Income Recovery Scenarios</TabsTrigger>
            <TabsTrigger value="milestones" data-testid="tab-milestones">Capital Threshold Events</TabsTrigger>
            <TabsTrigger value="spending" data-testid="tab-spending">Expense Sensitivity Ranking</TabsTrigger>
            <TabsTrigger value="stress" data-testid="tab-stress">Stress Testing</TabsTrigger>
            {showMortgageTab && (
              <TabsTrigger value="mortgage" data-testid="tab-mortgage">Mortgage Sensitivity</TabsTrigger>
            )}
            <TabsTrigger value="supplementary" data-testid="tab-supplementary">Supplementary</TabsTrigger>
          </TabsList>

          <TabsContent value="trajectory" className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <StabilityBadge band={result.stabilityBand} score={result.stabilityScore} />
            </div>

            {result.stabilityExplanation.factors.length > 0 && (
              <Card data-testid="card-stability-factors">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm font-medium mb-2">Stability Factors</p>
                  <ul className="space-y-1">
                    {result.stabilityExplanation.factors.map((factor, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2" data-testid={`text-factor-${i}`}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card data-testid="card-metric-depletion">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Months Until Depletion</p>
                  <p className="text-2xl font-bold" data-testid="text-months-depletion">
                    {formatMonths(result.monthsUntilDepletion)}
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-capital">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Starting Capital</p>
                  <p className="text-2xl font-bold" data-testid="text-starting-capital">
                    {formatGBP(result.startingCapital)}
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-burn">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Monthly Net Burn</p>
                  <p className="text-2xl font-bold" data-testid="text-monthly-burn">
                    {formatGBP(result.monthlyBurn)}
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-split">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Essential / Non-Essential</p>
                  <p className="text-lg font-bold" data-testid="text-expense-split">
                    {formatGBP(result.essentialExpenses)} / {formatGBP(result.nonEssentialExpenses)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card data-testid="card-trajectory-chart">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Capital Trajectory</CardTitle>
              </CardHeader>
              <CardContent>
                <CapitalTrajectoryChart projections={result.projections} />
              </CardContent>
            </Card>

            <Card data-testid="card-capital-recovery">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingDown className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Capital Recovery</p>
                    {result.capitalRecovery.recovers ? (
                      <p className="text-xs text-muted-foreground leading-relaxed" data-testid="text-recovery-positive">
                        Under these assumptions, capital would return to starting level at month{" "}
                        <span className="font-semibold text-foreground">{result.capitalRecovery.recoveryMonth}</span>
                        {result.capitalRecovery.rebuildDuration !== null && (
                          <> ({result.capitalRecovery.rebuildDuration} months post-reemployment)</>
                        )}.
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground leading-relaxed" data-testid="text-recovery-negative">
                        Under these assumptions, capital does not return to starting level within the projection period.
                      </p>
                    )}
                    {inputs.monthsUntilNewJob > 0 && (
                      <p className="text-xs text-muted-foreground mt-2" data-testid="text-capital-12m-post">
                        Capital at 12 months post-reemployment:{" "}
                        <span className="font-semibold text-foreground">
                          {formatGBP(result.capitalRecovery.capitalAt12MonthsPostReemployment)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <MonthlyDataTable projections={result.projections} />
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="mb-2">
              <h2 className="font-serif text-lg font-semibold mb-1">Income Recovery Scenarios</h2>
              <p className="text-xs text-muted-foreground">
                Illustrative comparison of capital trajectories under different income assumptions.
              </p>
            </div>

            <Card data-testid="card-scenario-chart">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Scenario Overlay</CardTitle>
              </CardHeader>
              <CardContent>
                <ScenarioOverlayChart scenarios={scenarios} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {scenarios.map((s, i) => (
                <Card key={i} data-testid={`card-scenario-${i}`}>
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.name}</p>
                    <p className="text-2xl font-bold">{formatMonths(s.result.monthsUntilDepletion)}</p>
                    <p className="text-xs text-muted-foreground mt-2">{s.description}</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between gap-1 text-xs">
                        <span className="text-muted-foreground">At 3 months</span>
                        <span className="font-medium">{formatGBP(s.result.capitalAfter3Months)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-xs">
                        <span className="text-muted-foreground">At 6 months</span>
                        <span className="font-medium">{formatGBP(s.result.capitalAfter6Months)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-xs">
                        <span className="text-muted-foreground">At 12 months</span>
                        <span className="font-medium">{formatGBP(s.result.capitalAfter12Months)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-xs">
                        <span className="text-muted-foreground">Stability</span>
                        <StabilityBadge band={s.result.stabilityBand} score={s.result.stabilityScore} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card data-testid="card-scenario-comparison-table">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Scenario Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" data-testid="table-scenario-comparison">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-medium text-muted-foreground">Metric</th>
                        {scenarios.map((s, i) => (
                          <th key={i} className="text-right py-2 px-2 font-medium text-muted-foreground">{s.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1.5 px-2 text-muted-foreground">Runway</td>
                        {scenarios.map((s, i) => (
                          <td key={i} className="py-1.5 px-2 text-right font-medium">{formatMonths(s.result.monthsUntilDepletion)}</td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 px-2 text-muted-foreground">Capital at 6mo</td>
                        {scenarios.map((s, i) => (
                          <td key={i} className="py-1.5 px-2 text-right font-medium">{formatGBP(s.result.capitalAfter6Months)}</td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 px-2 text-muted-foreground">Capital at 12mo</td>
                        {scenarios.map((s, i) => (
                          <td key={i} className="py-1.5 px-2 text-right font-medium">{formatGBP(s.result.capitalAfter12Months)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2 text-muted-foreground">Monthly Burn</td>
                        {scenarios.map((s, i) => (
                          <td key={i} className="py-1.5 px-2 text-right font-medium">{formatGBP(s.result.monthlyBurn)}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {showVRComparison && vrComparison && (
              <Card data-testid="card-vr-comparison">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Voluntary Redundancy — Package Comparison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Under these assumptions, the table below compares the runway projected from your statutory entitlement against the voluntary redundancy package amount entered.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg border p-3 space-y-1" data-testid="card-vr-statutory">
                      <p className="text-xs text-muted-foreground">Statutory package</p>
                      <p className="text-xl font-bold">{formatGBP(vrComparison.statutoryPackageTotal)}</p>
                      <p className="text-sm font-semibold mt-1">{formatMonths(vrComparison.statutoryRunway)}</p>
                      <p className="text-xs text-muted-foreground">projected runway</p>
                    </div>
                    <div className="rounded-lg border p-3 space-y-1 bg-primary/5" data-testid="card-vr-voluntary">
                      <p className="text-xs text-muted-foreground">Voluntary redundancy package</p>
                      <p className="text-xl font-bold">{formatGBP(vrComparison.vrPackageTotal)}</p>
                      <p className="text-sm font-semibold mt-1">{formatMonths(vrComparison.vrRunway)}</p>
                      <p className="text-xs text-muted-foreground">projected runway</p>
                    </div>
                    <div className="rounded-lg border p-3 space-y-1" data-testid="card-vr-delta">
                      <p className="text-xs text-muted-foreground">Package difference</p>
                      <p className="text-xl font-bold">{vrComparison.delta >= 0 ? "+" : ""}{formatMonths(vrComparison.delta)}</p>
                      <p className="text-sm font-semibold mt-1">{formatGBP(vrComparison.vrPackageTotal - vrComparison.statutoryPackageTotal)}</p>
                      <p className="text-xs text-muted-foreground">additional capital</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Illustrative projection only. VR package tax treatment may differ from statutory. Consult a tax adviser for your specific circumstances.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <div className="mb-2">
              <h2 className="font-serif text-lg font-semibold mb-1">Capital Threshold Events</h2>
              <p className="text-xs text-muted-foreground">
                Under these assumptions, the following threshold events are projected to occur.
              </p>
            </div>

            <Card data-testid="card-milestones-timeline">
              <CardContent className="pt-4 pb-4">
                {result.milestones.length === 0 ? (
                  <div className="text-center py-6">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">No threshold events reached within the projection period.</p>
                    <p className="text-xs text-muted-foreground mt-1">Under these assumptions, capital remains above all threshold levels.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {result.milestones.map((m, i) => (
                      <div key={i} className="flex items-start gap-3" data-testid={`milestone-${i}`}>
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          m.severity === "critical" ? "bg-destructive" : m.severity === "warning" ? "bg-yellow-500 dark:bg-yellow-400" : "bg-primary"
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-sm font-medium">Month {m.month}</p>
                            <Badge
                              variant={m.severity === "critical" ? "destructive" : m.severity === "warning" ? "secondary" : "outline"}
                              data-testid={`badge-severity-${i}`}
                            >
                              {m.severity === "critical" ? "Critical" : m.severity === "warning" ? "Warning" : "Info"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {essentialComparison.monthlySaving > 0 && (
              <Card data-testid="card-essential-comparison">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Info className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Essential-Only Comparison</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Under these assumptions, removing all non-essential spending ({formatGBP(essentialComparison.monthlySaving)}/mo)
                        would extend the projection by approximately{" "}
                        <span className="font-semibold text-foreground">
                          {essentialComparison.extraMonths > 0 ? `${essentialComparison.extraMonths} months` : "no additional months"}
                        </span>
                        {essentialComparison.extraMonths > 0 && (
                          <> (from {formatMonths(essentialComparison.fullRunway)} to {formatMonths(essentialComparison.essentialOnlyRunway)})</>
                        )}.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                data-testid="button-copy-milestones"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                {copied ? "Copied" : "Copy Summary"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="spending" className="space-y-6">
            <div className="mb-2">
              <h2 className="font-serif text-lg font-semibold mb-1">Expense Sensitivity Ranking</h2>
              <p className="text-xs text-muted-foreground">
                Rankings show the projected runway impact of each spending adjustment, sorted by extension impact. This is not advice on which expenses to adjust.
              </p>
            </div>

            {spendingImpacts.length === 0 ? (
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground text-center">No discretionary spending entered for analysis.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {spendingImpacts.every(i => i.runwayExtensionMonths <= 0) && (
                  <Card data-testid="card-spending-info">
                    <CardContent className="pt-4 pb-4 flex items-start gap-3">
                      <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Runway already exceeds the 60-month projection window. Individual spending changes don't extend it further under these assumptions, but the monthly savings below still represent real cashflow improvements.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card data-testid="card-spending-impact-table">
                  <CardContent className="pt-4 pb-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs" data-testid="table-spending-impact">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2 font-medium text-muted-foreground">Adjustment</th>
                            <th className="text-right py-2 px-2 font-medium text-muted-foreground">Current</th>
                            <th className="text-right py-2 px-2 font-medium text-muted-foreground">Saving</th>
                            <th className="text-right py-2 px-2 font-medium text-muted-foreground">Runway Impact</th>
                            <th className="text-center py-2 px-2 font-medium text-muted-foreground">Effort</th>
                          </tr>
                        </thead>
                        <tbody>
                          {spendingImpacts.map((item, i) => (
                            <tr key={i} className="border-b last:border-0" data-testid={`spending-impact-${i}`}>
                              <td className="py-2 px-2">{item.category}</td>
                              <td className="py-2 px-2 text-right">{formatGBP(item.currentAmount)}/mo</td>
                              <td className="py-2 px-2 text-right">{formatGBP(item.reductionAmount)}/mo</td>
                              <td className="py-2 px-2 text-right">
                                {item.runwayExtensionMonths > 0 ? (
                                  <span className="font-semibold text-primary">+{item.runwayExtensionMonths.toFixed(1)} months</span>
                                ) : (
                                  <span className="text-muted-foreground">{formatGBP(item.reductionAmount * 12)}/yr saved</span>
                                )}
                              </td>
                              <td className="py-2 px-2 text-center">
                                <Badge variant="outline">{item.effort}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="stress" className="space-y-6">
            <div className="mb-2">
              <h2 className="font-serif text-lg font-semibold mb-1">Stress Testing</h2>
              <p className="text-xs text-muted-foreground">
                Under these assumptions, this illustrates how the projection changes when key variables are adjusted. These are not predictions.
              </p>
            </div>

            <Card data-testid="card-stress-table">
              <CardContent className="pt-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" data-testid="table-stress-testing">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-medium text-muted-foreground">Assumption Change</th>
                        <th className="text-right py-2 px-2 font-medium text-muted-foreground">Base Runway</th>
                        <th className="text-right py-2 px-2 font-medium text-muted-foreground">Adjusted Runway</th>
                        <th className="text-right py-2 px-2 font-medium text-muted-foreground">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensitivityResults.map((r, i) => (
                        <tr key={i} className="border-b last:border-0" data-testid={`sensitivity-${i}`}>
                          <td className="py-2 px-2">{r.label}</td>
                          <td className="py-2 px-2 text-right">{formatMonths(r.baseRunway)}</td>
                          <td className="py-2 px-2 text-right">{formatMonths(r.adjustedRunway)}</td>
                          <td className={`py-2 px-2 text-right font-semibold ${
                            r.difference < 0 ? "text-destructive" : r.difference > 0 ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {r.difference === 0
                              ? "No change"
                              : `${r.difference > 0 ? "+" : ""}${r.difference.toFixed(1)} months`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {showMortgageTab && (
            <TabsContent value="mortgage" className="space-y-6">
              <div className="mb-2">
                <h2 className="font-serif text-lg font-semibold mb-1">Mortgage Sensitivity</h2>
                <p className="text-xs text-muted-foreground">
                  Under these assumptions, this illustrates the impact of potential housing cost increases on the capital projection.
                </p>
              </div>

              <Card data-testid="card-mortgage-current">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Current Monthly Housing Cost</p>
                  <p className="text-2xl font-bold" data-testid="text-current-housing">
                    {formatGBP(inputs.mortgageOrRent)}
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-mortgage-table">
                <CardContent className="pt-4 pb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs" data-testid="table-mortgage-sensitivity">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-medium text-muted-foreground">Scenario</th>
                          <th className="text-right py-2 px-2 font-medium text-muted-foreground">New Housing Cost</th>
                          <th className="text-right py-2 px-2 font-medium text-muted-foreground">Adjusted Runway</th>
                          <th className="text-right py-2 px-2 font-medium text-muted-foreground">Difference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mortgageSensitivity.map((r, i) => (
                          <tr key={i} className="border-b last:border-0" data-testid={`mortgage-sensitivity-${i}`}>
                            <td className="py-2 px-2">{r.label}</td>
                            <td className="py-2 px-2 text-right font-medium">{formatGBP(r.newHousingCost)}/mo</td>
                            <td className="py-2 px-2 text-right">{formatMonths(r.adjustedRunway)}</td>
                            <td className={`py-2 px-2 text-right font-semibold ${
                              r.difference < 0 ? "text-destructive" : r.difference > 0 ? "text-primary" : "text-muted-foreground"
                            }`}>
                              {r.difference === 0
                                ? "No change"
                                : `${r.difference > 0 ? "+" : ""}${r.difference.toFixed(1)} months`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4 flex items-start gap-3">
                  <Home className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Housing cost sensitivity shows the effect of rate changes on the overall projection. Under these assumptions, even modest increases can materially alter the capital trajectory.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          <TabsContent value="supplementary" className="space-y-6">
            <div className="mb-2">
              <h2 className="font-serif text-lg font-semibold mb-1">Supplementary Analysis</h2>
              <p className="text-xs text-muted-foreground">
                Contextual UK data provided for reference only. These figures do not affect your individual projection.
              </p>
            </div>

            <Card data-testid="card-redundancy-environment">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">UK Redundancy Environment (Context)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Total redundancies (latest quarter):</span>
                    <span className="font-medium" data-testid="text-total-redundancies">{ukBenchmarks.redundancyContext.totalRedundanciesLabel}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Year-on-year change:</span>
                    <span className="font-medium" data-testid="text-yoy-change">+{ukBenchmarks.redundancyContext.yoyChangePercent}%</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Data last updated:</span>
                    <span className="font-medium">{ukBenchmarks.redundancyContext.quarter}</span>
                  </div>
                  {ukBenchmarks.redundancyContext.sectorHighlights.length > 0 && (
                    <div className="mt-3 pt-3 border-t space-y-1">
                      {ukBenchmarks.redundancyContext.sectorHighlights.map((s, i) => (
                        <p key={i} className="text-xs text-muted-foreground" data-testid={`text-sector-highlight-${i}`}>
                          {s.sector} redundancies: +{s.yoyChangePercent}% YoY.
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70 italic mt-4">
                  National labour market statistics provided for context only. These figures do not affect your individual projection.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-savings-benchmark-context">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Savings Position Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Your starting capital:</span>
                    <span className="font-medium">{formatGBP(result.startingCapital)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">UK median household savings:</span>
                    <span className="font-medium">{formatGBP(ukBenchmarks.savingsBenchmarks.medianHouseholdSavings)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Upper quartile threshold:</span>
                    <span className="font-medium">{formatGBP(ukBenchmarks.savingsBenchmarks.upperQuartileThreshold)}+</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3" data-testid="text-savings-context-label">{savingsLabel}</p>
                <p className="text-xs text-muted-foreground/70 italic mt-2">
                  Source: {ukBenchmarks.savingsBenchmarks.source} ({ukBenchmarks.savingsBenchmarks.year}).
                </p>
              </CardContent>
            </Card>

            {inputs.mortgageOrRent > 0 && (
              <Card data-testid="card-housing-context-detail">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Housing Exposure Detail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Your housing costs represent <span className="font-medium">{housingPercent}%</span> of essential expenditure.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reference housing burden benchmark: {ukBenchmarks.housingBurden.typicalBurdenPercent}% (UK average, ONS {ukBenchmarks.housingBurden.year}).
                    </p>
                    {housingPercent > ukBenchmarks.housingBurden.stressReferenceThresholdPercent && (
                      <p className="text-xs text-muted-foreground">
                        Your housing exposure is above the model reference threshold ({ukBenchmarks.housingBurden.stressReferenceThresholdPercent}%).
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

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
  );
}
