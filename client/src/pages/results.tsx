import { useLocation } from "wouter";
import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TrendingDown,
  BarChart3,
  Shield,
  Clock,
  ArrowLeft,
  AlertTriangle,
  Info,
  LineChart,
  Target,
  RefreshCw,
  Copy,
  Check,
  Table2,
  Scissors,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Legend,
} from "recharts";
import { useWizardStore } from "@/lib/wizardStore";
import {
  computeRunway,
  computeScenarios,
  computeSpendingImpact,
  computeSensitivity,
  computeEssentialOnlyComparison,
  formatGBP,
  formatMonths,
} from "@/lib/engine";
import { getSectorData } from "@/lib/sectorData";
import type { RunwayResult, ScenarioComparison } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

function StabilityBadge({ band }: { band: RunwayResult["stabilityBand"] }) {
  const variant = band === "Stable" ? "default" : band === "Watch" ? "secondary" : "destructive";
  return <Badge variant={variant} data-testid="badge-stability">{band}</Badge>;
}

function ProjectionChart({ projections }: { projections: RunwayResult["projections"] }) {
  const maxMonth = projections.findIndex(p => p.capital <= 0);
  const displayMax = maxMonth > 0 ? Math.min(maxMonth + 3, 36) : 36;
  const data = projections.filter((_, i) => i <= displayMax);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="capitalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(185, 65%, 35%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(185, 65%, 35%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="month"
          tickFormatter={(v) => `M${v}`}
          className="text-xs"
          tick={{ fill: "hsl(200, 10%, 40%)", fontSize: 11 }}
        />
        <YAxis
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          className="text-xs"
          tick={{ fill: "hsl(200, 10%, 40%)", fontSize: 11 }}
          width={50}
        />
        <RechartsTooltip
          formatter={(value: number) => [formatGBP(value), "Capital"]}
          labelFormatter={(label) => `Month ${label}`}
          contentStyle={{
            backgroundColor: "hsl(195, 18%, 96%)",
            border: "1px solid hsl(195, 15%, 88%)",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        />
        <Area
          type="monotone"
          dataKey="capital"
          stroke="hsl(185, 65%, 35%)"
          strokeWidth={2}
          fill="url(#capitalGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ScenarioOverlayChart({ scenarios }: { scenarios: ScenarioComparison[] }) {
  const maxMonths = Math.max(
    ...scenarios.map(s =>
      s.result.monthsUntilDepletion < 60 ? s.result.monthsUntilDepletion + 3 : 36
    )
  );
  const displayMax = Math.min(maxMonths, 36);

  const data = Array.from({ length: displayMax + 1 }, (_, month) => ({
    month,
    ...Object.fromEntries(
      scenarios.map((s, i) => [
        `scenario${i}`,
        s.result.projections[Math.min(month, s.result.projections.length - 1)]?.capital ?? 0,
      ])
    ),
  }));

  const colors = ["hsl(0, 65%, 50%)", "hsl(45, 70%, 45%)", "hsl(185, 65%, 35%)"];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="month"
          tickFormatter={(v) => `M${v}`}
          tick={{ fill: "hsl(200, 10%, 40%)", fontSize: 11 }}
        />
        <YAxis
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          tick={{ fill: "hsl(200, 10%, 40%)", fontSize: 11 }}
          width={50}
        />
        <RechartsTooltip
          formatter={(value: number, name: string) => {
            const idx = parseInt(name.replace("scenario", ""));
            return [formatGBP(value), scenarios[idx]?.name ?? name];
          }}
          labelFormatter={(label) => `Month ${label}`}
          contentStyle={{
            backgroundColor: "hsl(195, 18%, 96%)",
            border: "1px solid hsl(195, 15%, 88%)",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        />
        <Legend
          formatter={(value: string) => {
            const idx = parseInt(value.replace("scenario", ""));
            return scenarios[idx]?.name ?? value;
          }}
          wrapperStyle={{ fontSize: "11px" }}
        />
        {scenarios.map((_, i) => (
          <Line
            key={i}
            type="monotone"
            dataKey={`scenario${i}`}
            stroke={colors[i]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

function ScenarioCards({ scenarios }: { scenarios: ScenarioComparison[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {scenarios.map((s, i) => (
        <Card key={i} data-testid={`card-scenario-${i}`}>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground mb-1">{s.name}</p>
            <p className="text-2xl font-bold text-primary">{formatMonths(s.result.monthsUntilDepletion)}</p>
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
                <StabilityBadge band={s.result.stabilityBand} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MilestoneTimeline({ milestones }: { milestones: RunwayResult["milestones"] }) {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-6">
        <Shield className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground">No threshold milestones reached within projection period.</p>
        <p className="text-xs text-muted-foreground mt-1">Under these assumptions, capital remains above all threshold levels.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {milestones.map((m, i) => (
        <div key={i} className="flex items-start gap-3" data-testid={`milestone-${i}`}>
          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
            m.severity === "critical" ? "bg-destructive" : m.severity === "warning" ? "bg-yellow-500" : "bg-primary"
          }`} />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-sm font-medium">Month {m.month}</p>
              <Badge variant={m.severity === "critical" ? "destructive" : "secondary"} className="text-[10px]">
                {m.severity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthlyDataTable({ projections }: { projections: RunwayResult["projections"] }) {
  const [showAll, setShowAll] = useState(false);
  const relevantMonths = projections.filter(p => p.month > 0);
  const displayMonths = showAll ? relevantMonths : relevantMonths.slice(0, 12);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 font-medium text-muted-foreground">Month</th>
              <th className="text-right py-2 px-2 font-medium text-muted-foreground">Income</th>
              <th className="text-right py-2 px-2 font-medium text-muted-foreground">Expenses</th>
              <th className="text-right py-2 px-2 font-medium text-muted-foreground">Net</th>
              <th className="text-right py-2 px-2 font-medium text-muted-foreground">Capital</th>
            </tr>
          </thead>
          <tbody>
            {displayMonths.map((p) => (
              <tr key={p.month} className={`border-b last:border-0 ${p.capital <= 0 ? "text-destructive" : ""}`}
                  data-testid={`table-row-month-${p.month}`}>
                <td className="py-1.5 px-2 font-medium">{p.month}</td>
                <td className="py-1.5 px-2 text-right">{formatGBP(p.income)}</td>
                <td className="py-1.5 px-2 text-right">{formatGBP(p.expenses)}</td>
                <td className={`py-1.5 px-2 text-right ${p.netBurn > 0 ? "text-destructive" : "text-primary"}`}>
                  {p.netBurn > 0 ? `-${formatGBP(p.netBurn)}` : `+${formatGBP(Math.abs(p.netBurn))}`}
                </td>
                <td className="py-1.5 px-2 text-right font-medium">{formatGBP(p.capital)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {relevantMonths.length > 12 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setShowAll(!showAll)}
          data-testid="button-toggle-table"
        >
          {showAll ? "Show first 12 months" : `Show all ${relevantMonths.length} months`}
        </Button>
      )}
    </div>
  );
}

function EssentialOnlyInsight({ inputs }: { inputs: Parameters<typeof computeEssentialOnlyComparison>[0] }) {
  const comparison = useMemo(() => computeEssentialOnlyComparison(inputs), [inputs]);

  if (comparison.monthlySaving <= 0) {
    return null;
  }

  return (
    <Card className="mb-4" data-testid="card-essential-insight">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Scissors className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Discretionary spending insight</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Under these assumptions, removing all non-essential spending ({formatGBP(comparison.monthlySaving)}/mo)
              would extend the projection by approximately{" "}
              <span className="font-semibold text-foreground">
                {comparison.extraMonths > 0 ? `${comparison.extraMonths} months` : "no additional months"}
              </span>
              {comparison.extraMonths > 0 && (
                <> (from {formatMonths(comparison.fullRunway)} to {formatMonths(comparison.essentialOnlyRunway)})</>
              )}.
              {comparison.extraMonths <= 0 && comparison.fullRunway >= 60 && " Runway already exceeds projection period under current assumptions."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SpendingImpactSection({ inputs }: { inputs: Parameters<typeof computeSpendingImpact>[0] }) {
  const impacts = useMemo(() => computeSpendingImpact(inputs), [inputs]);

  if (impacts.length === 0) {
    return <p className="text-sm text-muted-foreground">No discretionary spending entered for analysis.</p>;
  }

  const allZero = impacts.every(i => i.runwayExtensionMonths <= 0);

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        Rankings show projected runway impact of each spending adjustment. This is not advice on which expenses to adjust.
      </p>
      {allZero && (
        <div className="rounded-md bg-muted/50 p-3 mb-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Runway already exceeds the 60-month projection window. Individual spending changes don't extend it further under these assumptions, but the monthly savings below still represent real cashflow improvements.
          </p>
        </div>
      )}
      {impacts.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50" data-testid={`spending-impact-${i}`}>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{item.category}</p>
            <p className="text-xs text-muted-foreground">
              Currently {formatGBP(item.currentAmount)}/mo | Save {formatGBP(item.reductionAmount)}/mo
            </p>
          </div>
          <div className="text-right shrink-0">
            {item.runwayExtensionMonths > 0 ? (
              <p className="text-sm font-semibold text-primary">
                +{item.runwayExtensionMonths.toFixed(1)} months
              </p>
            ) : (
              <p className="text-sm font-semibold text-muted-foreground">
                {formatGBP(item.reductionAmount * 12)}/yr saved
              </p>
            )}
            <Badge variant="outline" className="text-[10px]">{item.effort} effort</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function SensitivitySection({ inputs }: { inputs: Parameters<typeof computeSensitivity>[0] }) {
  const results = useMemo(() => computeSensitivity(inputs), [inputs]);

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        Shows how the projection changes when key assumptions are varied. Illustrates sensitivity, not predictions.
      </p>
      {results.map((r, i) => (
        <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50" data-testid={`sensitivity-${i}`}>
          <p className="text-sm min-w-0">{r.label}</p>
          <div className="text-right shrink-0">
            <p className={`text-sm font-semibold ${r.difference < 0 ? "text-destructive" : r.difference > 0 ? "text-primary" : "text-muted-foreground"}`}>
              {r.difference > 0 ? "+" : ""}{r.difference === 0 ? "No change" : `${r.difference.toFixed(1)} months`}
            </p>
            <p className="text-xs text-muted-foreground">{formatMonths(r.adjustedRunway)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectorIntelligence({ sector }: { sector: string }) {
  const data = getSectorData(sector);

  return (
    <div>
      <Card>
        <CardContent className="pt-4 pb-4">
          <p className="font-medium text-sm mb-3" data-testid="text-sector-name">{data.sector}</p>
          <p className="text-xs text-muted-foreground mb-3">
            Historical median time to reemployment for this sector. Individual outcomes vary significantly.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded bg-muted/50">
              <p className="text-xs text-muted-foreground">Faster (25th)</p>
              <p className="font-semibold" data-testid="text-sector-p25">{data.p25Weeks} weeks</p>
              <p className="text-[10px] text-muted-foreground">{(data.p25Weeks / 4.33).toFixed(1)} months</p>
            </div>
            <div className="p-2 rounded bg-primary/10">
              <p className="text-xs text-muted-foreground">Median</p>
              <p className="font-semibold text-primary" data-testid="text-sector-median">{data.medianWeeks} weeks</p>
              <p className="text-[10px] text-muted-foreground">{(data.medianWeeks / 4.33).toFixed(1)} months</p>
            </div>
            <div className="p-2 rounded bg-muted/50">
              <p className="text-xs text-muted-foreground">Slower (75th)</p>
              <p className="font-semibold" data-testid="text-sector-p75">{data.p75Weeks} weeks</p>
              <p className="text-[10px] text-muted-foreground">{(data.p75Weeks / 4.33).toFixed(1)} months</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Source: {data.source} | Last updated: {data.lastUpdated}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This data does not predict your specific job search duration. Individual outcomes vary.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CheckInSection({ inputs }: { inputs: Parameters<typeof computeRunway>[0] }) {
  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const [actualCapital, setActualCapital] = useState<string>("");
  const [checkInMonth, setCheckInMonth] = useState<string>("1");

  const monthNum = parseInt(checkInMonth) || 1;
  const projected = result.projections[Math.min(monthNum, result.projections.length - 1)]?.capital ?? 0;
  const actual = parseFloat(actualCapital) || 0;
  const variance = actual > 0 ? actual - projected : 0;
  const variancePercent = projected > 0 && actual > 0 ? ((actual - projected) / projected * 100) : 0;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Compare actual remaining capital against the projection at any month. Shows whether spending is tracking above or below assumptions.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="checkin-month" className="text-sm">Check-in Month</Label>
          <Input
            id="checkin-month"
            type="number"
            min={1}
            max={60}
            value={checkInMonth}
            onChange={(e) => setCheckInMonth(e.target.value)}
            data-testid="input-checkin-month"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="actual-capital" className="text-sm">Actual Capital</Label>
          <Input
            id="actual-capital"
            type="number"
            min={0}
            value={actualCapital}
            onChange={(e) => setActualCapital(e.target.value)}
            placeholder="Enter amount"
            data-testid="input-actual-capital"
          />
        </div>
      </div>
      {actual > 0 && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Projected</p>
                <p className="font-semibold" data-testid="text-checkin-projected">{formatGBP(projected)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Actual</p>
                <p className="font-semibold" data-testid="text-checkin-actual">{formatGBP(actual)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Variance</p>
                <p className={`font-semibold ${variance >= 0 ? "text-primary" : "text-destructive"}`} data-testid="text-checkin-variance">
                  {variance >= 0 ? "+" : ""}{formatGBP(variance)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Variance %</p>
                <p className={`font-semibold ${variancePercent >= 0 ? "text-primary" : "text-destructive"}`}>
                  {variancePercent >= 0 ? "+" : ""}{variancePercent.toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              {variance > 0
                ? "Actual capital is above the projected amount at this point."
                : variance < 0
                ? "Actual capital is below the projected amount at this point."
                : "Actual capital matches the projection."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { inputs } = useWizardStore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const scenarios = useMemo(() => computeScenarios(inputs), [inputs]);

  const startingCapital = inputs.cashSavings + inputs.liquidInvestments + inputs.redundancyPayout + inputs.otherOneOffIncome;

  const copySummary = useCallback(() => {
    const summary = [
      "RedundancyRunway Projection Summary",
      "====================================",
      `Date: ${new Date().toLocaleDateString("en-GB")}`,
      "",
      "ASSUMPTIONS:",
      `  Starting Capital: ${formatGBP(startingCapital)}`,
      `  Monthly Income (during gap): ${formatGBP(inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate)}`,
      `  Essential Expenses: ${formatGBP(result.essentialExpenses)}/mo`,
      `  Non-Essential Expenses: ${formatGBP(result.nonEssentialExpenses)}/mo`,
      `  Total Expenses: ${formatGBP(result.totalExpenses)}/mo`,
      `  Months Until New Income: ${inputs.monthsUntilNewJob}`,
      "",
      "PROJECTION:",
      `  Estimated Runway: ${formatMonths(result.monthsUntilDepletion)}`,
      `  Monthly Burn Rate: ${formatGBP(result.monthlyBurn)}`,
      `  Stability Score: ${result.stabilityScore}/100 (${result.stabilityBand})`,
      "",
      "CAPITAL AT KEY POINTS:",
      `  3 months: ${formatGBP(result.capitalAfter3Months)}`,
      `  6 months: ${formatGBP(result.capitalAfter6Months)}`,
      `  12 months: ${formatGBP(result.capitalAfter12Months)}`,
      "",
      "SCENARIOS:",
      ...scenarios.map(s => `  ${s.name}: ${formatMonths(s.result.monthsUntilDepletion)}`),
      "",
      "MILESTONES:",
      ...(result.milestones.length > 0
        ? result.milestones.map(m => `  Month ${m.month}: ${m.description}`)
        : ["  No threshold milestones reached within projection period"]),
      "",
      "This is an illustrative projection based on entered assumptions.",
      "It does not constitute financial advice.",
    ].join("\n");

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      toast({ title: "Summary copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    });
  }, [inputs, result, scenarios, startingCapital, toast]);

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Projection Results</h1>
            <p className="text-sm text-muted-foreground">Under your entered assumptions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={copySummary} data-testid="button-copy-summary">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy Summary"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/wizard")} data-testid="button-edit">
              <RefreshCw className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Runway</p>
              <p className="text-xl font-bold text-primary" data-testid="text-result-runway">{formatMonths(result.monthsUntilDepletion)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Starting Capital</p>
              <p className="text-xl font-bold" data-testid="text-starting-capital">{formatGBP(startingCapital)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Monthly Burn</p>
              <p className="text-xl font-bold" data-testid="text-monthly-burn">{formatGBP(result.monthlyBurn)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Stability</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-lg font-bold" data-testid="text-stability-score">{result.stabilityScore}</span>
                <StabilityBadge band={result.stabilityBand} />
              </div>
            </CardContent>
          </Card>
        </div>

        <EssentialOnlyInsight inputs={inputs} />

        <div className="rounded-md bg-muted/50 p-3 mb-6 flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            All figures reflect modelled outcomes under current assumptions. Changing any input will change the projection. This is not financial advice.
          </p>
        </div>

        <Tabs defaultValue="projection" className="mb-6">
          <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6">
            <TabsTrigger value="projection" data-testid="tab-projection">Timeline</TabsTrigger>
            <TabsTrigger value="scenarios" data-testid="tab-scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="milestones" data-testid="tab-milestones">Milestones</TabsTrigger>
            <TabsTrigger value="spending" data-testid="tab-spending">Spending</TabsTrigger>
            <TabsTrigger value="sensitivity" data-testid="tab-sensitivity">Sensitivity</TabsTrigger>
            <TabsTrigger value="more" data-testid="tab-more">More</TabsTrigger>
          </TabsList>

          <TabsContent value="projection" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm">Capital Projection Timeline</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">Month-by-month capital under your assumptions</p>
              </CardHeader>
              <CardContent>
                <ProjectionChart projections={result.projections} />
                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">3 months</p>
                    <p className="font-semibold text-sm" data-testid="text-timeline-3m">{formatGBP(result.capitalAfter3Months)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">6 months</p>
                    <p className="font-semibold text-sm" data-testid="text-timeline-6m">{formatGBP(result.capitalAfter6Months)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">12 months</p>
                    <p className="font-semibold text-sm" data-testid="text-timeline-12m">{formatGBP(result.capitalAfter12Months)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm">Monthly Projection Data</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">Detailed month-by-month income, expenses, and remaining capital</p>
              </CardHeader>
              <CardContent>
                <MonthlyDataTable projections={result.projections} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm">Scenario Comparison</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">
                  Projected outcomes under different income assumptions. Does not recommend which scenario is applicable to you.
                </p>
              </CardHeader>
              <CardContent>
                <ScenarioOverlayChart scenarios={scenarios} />
              </CardContent>
            </Card>
            <ScenarioCards scenarios={scenarios} />
          </TabsContent>

          <TabsContent value="milestones" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm">Milestone Timeline</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">Capital threshold markers based on your entered assumptions</p>
              </CardHeader>
              <CardContent>
                <MilestoneTimeline milestones={result.milestones} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spending" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm">Spending Impact Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <SpendingImpactSection inputs={inputs} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sensitivity" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm">Sensitivity Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <SensitivitySection inputs={inputs} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="more" className="mt-4 space-y-4">
            <Accordion type="multiple" defaultValue={["sector", "checkin", "assumptions"]}>
              <AccordionItem value="sector">
                <AccordionTrigger className="text-sm" data-testid="accordion-sector">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Sector Reemployment Intelligence
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <SectorIntelligence sector={inputs.sector} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="checkin">
                <AccordionTrigger className="text-sm" data-testid="accordion-checkin">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-primary" />
                    Monthly Check-In
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CheckInSection inputs={inputs} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="assumptions">
                <AccordionTrigger className="text-sm" data-testid="accordion-assumptions">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Assumptions Used
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Starting Capital</p>
                        <p className="font-medium">{formatGBP(startingCapital)}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Monthly Income (during gap)</p>
                        <p className="font-medium">{formatGBP(inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate)}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Essential Expenses</p>
                        <p className="font-medium">{formatGBP(result.essentialExpenses)}/mo</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Non-Essential Expenses</p>
                        <p className="font-medium">{formatGBP(result.nonEssentialExpenses)}/mo</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Months Until New Income</p>
                        <p className="font-medium">{inputs.monthsUntilNewJob}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Emergency Buffer</p>
                        <p className="font-medium">{formatGBP(inputs.emergencyBuffer)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      All outputs change when assumptions change. Verify figures against your actual financial records.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          <Button variant="outline" onClick={() => navigate("/wizard")} data-testid="button-back-wizard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Assumptions
          </Button>
          <Button variant="outline" onClick={() => navigate("/preview")} data-testid="button-back-preview">
            Back to Preview
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6 max-w-lg mx-auto">
          This tool provides illustrative financial projections based on assumptions you enter. It does not provide financial, employment, debt, or benefits advice. All projections are estimates and may not reflect your actual circumstances.
        </p>
      </div>
    </div>
  );
}
