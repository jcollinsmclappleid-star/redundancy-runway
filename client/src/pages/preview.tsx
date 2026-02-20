import { useLocation } from "wouter";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRight, ArrowLeft, BarChart2, TrendingDown, Shield, Activity, FileText, Home, Layers } from "lucide-react";
import { useWizardStore } from "@/lib/wizardStore";
import { computeRunway, computeEssentialOnlyComparison, formatGBP, formatMonths } from "@/lib/engine";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

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
        <div className="flex items-center gap-2 flex-wrap">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-md w-3/4" />
          <div className="h-4 bg-muted rounded-md w-1/2" />
          <div className="h-8 bg-muted rounded-md w-full mt-4" />
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

  const stabilityColor = result.stabilityBand === "Stable"
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
    : result.stabilityBand === "Watch"
    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

  return (
    <div className="min-h-screen">
      <DisclaimerBanner />

      <header className="flex items-center justify-between gap-4 px-6 py-4 border-b flex-wrap">
        <Logo />
        <Button variant="outline" onClick={() => navigate("/wizard")} data-testid="button-edit-inputs">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Edit Assumptions
        </Button>
      </header>

      <div className="max-w-2xl mx-auto py-10 px-6">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4" data-testid="badge-free-preview">
            Free Preview
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Projection Summary</h1>
          <p className="text-sm text-muted-foreground">Based on the assumptions entered</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">Under these assumptions, capital may last approximately</p>
            <div className="text-4xl sm:text-5xl font-bold mb-3 font-serif" data-testid="text-runway-months">
              {formatMonths(result.monthsUntilDepletion)}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Starting capital: {formatGBP(result.startingCapital)} | Net monthly burn: {formatGBP(result.monthlyBurn)}
            </p>
            <Badge className={`${stabilityColor} no-default-hover-elevate no-default-active-elevate`} data-testid="badge-preview-stability">
              {result.stabilityBand} ({result.stabilityScore}/100)
            </Badge>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-5 pb-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Capital at 3 months</p>
              <p className="font-semibold" data-testid="text-capital-3m">{formatGBP(result.capitalAfter3Months)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Capital at 6 months</p>
              <p className="font-semibold" data-testid="text-capital-6m">{formatGBP(result.capitalAfter6Months)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Capital at 12 months</p>
              <p className="font-semibold" data-testid="text-capital-12m">{formatGBP(result.capitalAfter12Months)}</p>
            </CardContent>
          </Card>
        </div>

        {essentialComparison.monthlySaving > 0 && (
          <Card className="mb-8" data-testid="card-preview-essential-insight">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Preliminary Insight</p>
                  <p className="text-xs text-muted-foreground">
                    If all non-essential spending ({formatGBP(essentialComparison.monthlySaving)}/mo) were removed,
                    the projection would
                    {essentialComparison.extraMonths > 0
                      ? ` extend by approximately ${essentialComparison.extraMonths} months under these assumptions.`
                      : " not extend further (runway already exceeds 60 months under these assumptions)."
                    }
                    {" "}The full analysis includes individual category impact rankings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3 mb-10">
          <LockedCard title="Income Recovery Scenarios" icon={BarChart2} />
          <LockedCard title="Capital Recovery Timeline" icon={TrendingDown} />
          <LockedCard title="Capital Threshold Events" icon={Shield} />
          <LockedCard title="Expense Sensitivity Ranking" icon={FileText} />
          <LockedCard title="Stress Testing" icon={Activity} />
          {inputs.mortgageOrRent > 0 && (
            <LockedCard title="Mortgage Sensitivity" icon={Home} />
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="pt-8 pb-8 text-center">
            <h3 className="font-serif font-semibold text-lg mb-2">Unlock Full Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Access income recovery scenarios, capital recovery timeline, threshold events,
              expense sensitivity ranking, stress testing, and mortgage sensitivity modelling.
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

        <p className="text-xs text-muted-foreground text-center">
          All projections are illustrative estimates based on assumptions entered. This tool does not constitute financial advice.
        </p>
      </div>
    </div>
  );
}
