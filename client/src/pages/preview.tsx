import { useLocation } from "wouter";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRight, ArrowLeft, Layers } from "lucide-react";
import { useWizardStore } from "@/lib/wizardStore";
import { computeRunway, computeEssentialOnlyComparison, formatGBP, formatMonths } from "@/lib/engine";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

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

  const lockedItems = [
    "Projection range (p25 / p50 / p75)",
    "60-month capital trajectory",
    "Income recovery scenarios",
    "Capital recovery timeline",
    "Expense sensitivity ranking",
    "Stress testing",
    "UK benchmark context",
    ...(inputs.mortgageOrRent > 0 ? ["Mortgage sensitivity"] : []),
    "Structured export",
  ];

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

        <Card className="mb-6">
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

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "3 months", value: result.capitalAfter3Months, id: "3m" },
            { label: "6 months", value: result.capitalAfter6Months, id: "6m" },
            { label: "12 months", value: result.capitalAfter12Months, id: "12m" },
          ].map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Capital at {item.label}</p>
                <p className="font-semibold text-sm" data-testid={`text-capital-${item.id}`}>{formatGBP(item.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {essentialComparison.monthlySaving > 0 && (
          <Card className="mb-8" data-testid="card-preview-essential-insight">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-muted-foreground" />
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
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6" data-testid="card-unlock-cta">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-6">
              <h3 className="font-serif font-semibold text-lg mb-1">Unlock Full Projection Model</h3>
              <p className="text-xs text-muted-foreground">
                See exactly how different scenarios affect your timeline.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-6 max-w-md mx-auto">
              {lockedItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" data-testid={`locked-feature-${i}`}>
                  <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">{item}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold mb-1">&pound;49</div>
              <p className="text-xs text-muted-foreground mb-4">One-time payment. 6 months access. No subscription.</p>
              <Button className="w-full max-w-xs" onClick={() => navigate("/results")} data-testid="button-unlock">
                Unlock Full Model &mdash; &pound;49
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          All projections are illustrative estimates based on assumptions entered. Not financial advice.
        </p>
      </div>
    </div>
  );
}
