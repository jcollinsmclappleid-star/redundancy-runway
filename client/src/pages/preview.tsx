import { useLocation } from "wouter";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRight, Clock, BarChart3, TrendingDown, Shield, LineChart, FileText, Scissors } from "lucide-react";
import { useWizardStore } from "@/lib/wizardStore";
import { computeRunway, computeEssentialOnlyComparison, formatGBP, formatMonths } from "@/lib/engine";

function LockedCard({ title, icon: Icon }: { title: string; icon: typeof Lock }) {
  return (
    <Card className="relative overflow-hidden" data-testid={`locked-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">Unlock full analysis</span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-8 bg-muted rounded w-full mt-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PreviewPage() {
  const [, navigate] = useLocation();
  const { inputs } = useWizardStore();

  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const essentialComparison = useMemo(() => computeEssentialOnlyComparison(inputs), [inputs]);

  const startingCapital = inputs.cashSavings + inputs.liquidInvestments + inputs.redundancyPayout + inputs.otherOneOffIncome;

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4" data-testid="badge-free-preview">
            <Clock className="w-3 h-3 mr-1" />
            Free Preview
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Projection Summary</h1>
          <p className="text-muted-foreground text-sm">Based on the assumptions you entered</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Under your assumptions, savings may last approximately</p>
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2" data-testid="text-runway-months">
              {formatMonths(result.monthsUntilDepletion)}
            </div>
            <p className="text-xs text-muted-foreground">
              Starting capital: {formatGBP(startingCapital)} | Monthly burn: {formatGBP(result.monthlyBurn)}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge variant={result.stabilityBand === "Stable" ? "default" : result.stabilityBand === "Watch" ? "secondary" : "destructive"} data-testid="badge-preview-stability">
                {result.stabilityBand} ({result.stabilityScore}/100)
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Capital at 3 months</p>
              <p className="font-semibold" data-testid="text-capital-3m">{formatGBP(result.capitalAfter3Months)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Capital at 6 months</p>
              <p className="font-semibold" data-testid="text-capital-6m">{formatGBP(result.capitalAfter6Months)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Capital at 12 months</p>
              <p className="font-semibold" data-testid="text-capital-12m">{formatGBP(result.capitalAfter12Months)}</p>
            </CardContent>
          </Card>
        </div>

        {essentialComparison.monthlySaving > 0 && (
          <Card className="mb-6" data-testid="card-preview-essential-insight">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Scissors className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Quick insight</p>
                  <p className="text-xs text-muted-foreground">
                    Removing all non-essential spending ({formatGBP(essentialComparison.monthlySaving)}/mo) would
                    {essentialComparison.extraMonths > 0
                      ? ` extend the projection by approximately ${essentialComparison.extraMonths} months.`
                      : " not extend the projection further (runway already exceeds 60 months)."
                    }
                    {" "}Unlock full results to see individual spending impacts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3 mb-8">
          <LockedCard title="Scenario Comparison" icon={BarChart3} />
          <LockedCard title="Milestone Timeline" icon={TrendingDown} />
          <LockedCard title="Spending Impact Analysis" icon={LineChart} />
          <LockedCard title="Sensitivity Projections" icon={LineChart} />
          <LockedCard title="Monthly Data Table" icon={FileText} />
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 pb-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Unlock Full Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              See scenario comparisons, milestone timeline, spending impact analysis, sensitivity projections, and monthly data.
            </p>
            <div className="text-3xl font-bold mb-1">
              Coming Soon
            </div>
            <p className="text-xs text-muted-foreground mb-4">6 months unlimited access</p>
            <Button className="w-full max-w-xs" onClick={() => navigate("/results")} data-testid="button-unlock">
              View Full Results (Preview Mode)
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/wizard")} data-testid="button-edit-inputs">
            Edit Assumptions
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          All projections are illustrative estimates based on your entered assumptions. This is not financial advice.
        </p>
      </div>
    </div>
  );
}
