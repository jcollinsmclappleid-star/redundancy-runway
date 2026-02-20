import { useLocation } from "wouter";
import { useMemo, useState } from "react";
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
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";
import { useWizardStore } from "@/lib/wizardStore";
import {
  computeRunway,
  computeScenarios,
  computeSpendingImpact,
  computeSensitivity,
  formatGBP,
  formatMonths,
} from "@/lib/engine";
import { getSectorData, sectorReemploymentData } from "@/lib/sectorData";
import type { RunwayResult, ScenarioComparison } from "@shared/schema";

function StabilityBadge({ band }: { band: RunwayResult["stabilityBand"] }) {
  const variant = band === "Stable" ? "default" : band === "Watch" ? "secondary" : "destructive";
  return <Badge variant={variant} data-testid="badge-stability">{band}</Badge>;
}

function ProjectionChart({ projections }: { projections: RunwayResult["projections"] }) {
  const data = projections.filter((_, i) => i <= Math.min(projections.length - 1, 36));

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
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">At 12 months</span>
                <span className="font-medium">{formatGBP(s.result.capitalAfter12Months)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
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
    return <p className="text-sm text-muted-foreground">No threshold milestones reached within projection period.</p>;
  }

  return (
    <div className="space-y-3">
      {milestones.map((m, i) => (
        <div key={i} className="flex items-start gap-3" data-testid={`milestone-${i}`}>
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
            m.severity === "critical" ? "bg-destructive" : m.severity === "warning" ? "bg-yellow-500" : "bg-primary"
          }`} />
          <div>
            <p className="text-sm font-medium">Month {m.month}</p>
            <p className="text-xs text-muted-foreground">{m.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SpendingImpactSection({ inputs }: { inputs: Parameters<typeof computeSpendingImpact>[0] }) {
  const impacts = useMemo(() => computeSpendingImpact(inputs), [inputs]);

  if (impacts.length === 0) {
    return <p className="text-sm text-muted-foreground">No discretionary spending entered for analysis.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        Rankings show projected runway impact per £1 of spending reduction. This is not advice on which expenses to adjust.
      </p>
      {impacts.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50" data-testid={`spending-impact-${i}`}>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{item.category}</p>
            <p className="text-xs text-muted-foreground">
              Reduce by {formatGBP(item.reductionAmount)}/mo
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-primary">
              +{item.runwayExtensionMonths.toFixed(1)} months
            </p>
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
      {results.map((r, i) => (
        <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50" data-testid={`sensitivity-${i}`}>
          <p className="text-sm min-w-0">{r.label}</p>
          <div className="text-right shrink-0">
            <p className={`text-sm font-semibold ${r.difference < 0 ? "text-destructive" : "text-primary"}`}>
              {r.difference >= 0 ? "+" : ""}{r.difference.toFixed(1)} months
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
          <p className="font-medium text-sm mb-3">{data.sector}</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Fast (25th)</p>
              <p className="font-semibold">{data.p25Weeks} weeks</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Median</p>
              <p className="font-semibold text-primary">{data.medianWeeks} weeks</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Slow (75th)</p>
              <p className="font-semibold">{data.p75Weeks} weeks</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Source: {data.source} | Last updated: {data.lastUpdated}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Individual outcomes vary significantly. This data does not predict your specific job search duration.
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

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Track actual capital against projections. Enter your current remaining capital to see variance.
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
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Projected</p>
                <p className="font-semibold">{formatGBP(projected)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Actual</p>
                <p className="font-semibold">{formatGBP(actual)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Variance</p>
                <p className={`font-semibold ${variance >= 0 ? "text-primary" : "text-destructive"}`}>
                  {variance >= 0 ? "+" : ""}{formatGBP(variance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { inputs } = useWizardStore();

  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const scenarios = useMemo(() => computeScenarios(inputs), [inputs]);

  const startingCapital = inputs.cashSavings + inputs.liquidInvestments + inputs.redundancyPayout + inputs.otherOneOffIncome;

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Projection Results</h1>
            <p className="text-sm text-muted-foreground">Under your entered assumptions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/wizard")} data-testid="button-edit">
              <RefreshCw className="w-4 h-4 mr-2" />
              Edit Assumptions
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Runway</p>
              <p className="text-xl font-bold text-primary" data-testid="text-result-runway">{formatMonths(result.monthsUntilDepletion)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Starting Capital</p>
              <p className="text-xl font-bold">{formatGBP(startingCapital)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Monthly Burn</p>
              <p className="text-xl font-bold">{formatGBP(result.monthlyBurn)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Stability</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-lg font-bold">{result.stabilityScore}</span>
                <StabilityBadge band={result.stabilityBand} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-md bg-muted/50 p-3 mb-6 flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Score reflects modelled cashflow sustainability under current assumptions. All projections are illustrative estimates.
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

          <TabsContent value="projection" className="mt-4">
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
                    <p className="font-semibold text-sm">{formatGBP(result.capitalAfter3Months)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">6 months</p>
                    <p className="font-semibold text-sm">{formatGBP(result.capitalAfter6Months)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">12 months</p>
                    <p className="font-semibold text-sm">{formatGBP(result.capitalAfter12Months)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm">Scenario Comparison</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">
                  Projected financial outcomes under different income assumptions. Does not recommend which option is suitable for you.
                </p>
              </CardHeader>
              <CardContent>
                <ScenarioCards scenarios={scenarios} />
              </CardContent>
            </Card>
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
                  <CardTitle className="text-sm">Runway Impact of Spending Adjustments</CardTitle>
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
                <p className="text-xs text-muted-foreground">How changes in assumptions affect the projection</p>
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
