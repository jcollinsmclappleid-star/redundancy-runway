import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Layers, Check, Lock, Mail } from "lucide-react";
import { useWizardStore } from "@/lib/wizardStore";
import { computeRunway, computeEssentialOnlyComparison, computeRedundancyEstimate, computeScenarios, formatGBP, formatMonths } from "@/lib/engine";
import { buildPreviewConsoleScenarios, getResilienceDisplay } from "@/lib/runwayAssumptions";
import { SiteHeader } from "@/components/SiteHeader";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { RriGauge } from "@/components/rri-gauge";
import { CapitalCompositionChart } from "@/components/capital-composition-chart";
import { RunwayConsole, buildRunwayConsoleScenarios } from "@/components/runway-console";
import { ScenarioLeaderboard } from "@/components/scenario-leaderboard";
import { chartTheme } from "@/lib/chart-theme";
import { apiRequest } from "@/lib/queryClient";
import { getSessionToken } from "@/lib/sessionToken";
import { PersonalRunwayPreviewGap } from "@/components/private-runway-brief/PersonalRunwayPreviewGap";
import { StatutoryFreeSummary } from "@/components/package-dashboard/StatutoryFreeSummary";
import { LockedPackagePreviewGrid } from "@/components/package-dashboard/LockedPackagePreviewGrid";
import { PackageTotalHero } from "@/components/preview/PackageTotalHero";
import { PreviewIncomeAssumptionsPanel } from "@/components/preview/PreviewIncomeAssumptionsPanel";
import { PRODUCT_COPY, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";
import { WIDER_PACKAGE_TEASER, DASHBOARD_DISCLAIMER } from "@shared/complianceCopy";

export default function PreviewPage() {
  const [, navigate] = useLocation();
  const { inputs } = useWizardStore();
  const [accessEmail, setAccessEmail] = useState("");
  const [accessMessage, setAccessMessage] = useState("");
  const [accessLink, setAccessLink] = useState("");
  const [accessError, setAccessError] = useState("");
  const [savingAccess, setSavingAccess] = useState(false);

  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const resilience = useMemo(() => getResilienceDisplay(inputs, result), [inputs, result]);
  const previewScenarios = useMemo(() => buildPreviewConsoleScenarios(inputs), [inputs]);
  const consoleScenarios = useMemo(() => buildRunwayConsoleScenarios(previewScenarios), [previewScenarios]);
  const leaderboardScenarios = useMemo(() => computeScenarios(inputs), [inputs]);
  const essentialComparison = useMemo(() => computeEssentialOnlyComparison(inputs), [inputs]);
  const redundancyEstimate = useMemo(() => computeRedundancyEstimate(inputs.redundancyPackage), [inputs.redundancyPackage]);

  const redundancyTotal = useMemo(() => {
    const pkg = inputs.redundancyPackage;
    if (pkg.useManualOverride && pkg.manualOverrideAmount > 0) return pkg.manualOverrideAmount;
    return redundancyEstimate.totalEstimated;
  }, [inputs.redundancyPackage, redundancyEstimate]);

  const compositionSegments = useMemo(() => [
    { name: "Cash savings", value: inputs.cashSavings },
    { name: "Liquid investments", value: inputs.liquidInvestments },
    { name: "Redundancy package", value: redundancyTotal },
    { name: "Other one-off", value: inputs.otherOneOffIncome + (inputs.unpaidWages ?? 0) },
  ], [inputs, redundancyTotal]);

  const composition = useMemo(() => [
    { label: "Cash savings", value: inputs.cashSavings, color: chartTheme.color.cash },
    { label: "Liquid investments", value: inputs.liquidInvestments, color: chartTheme.color.investments },
    { label: "Redundancy package", value: redundancyTotal, color: chartTheme.color.redundancy },
    { label: "Other one-off", value: inputs.otherOneOffIncome + (inputs.unpaidWages ?? 0), color: chartTheme.color.s4 },
  ].filter((c) => c.value > 0), [inputs, redundancyTotal]);

  const stabilityColor = resilience.band === "Stable"
    ? "bg-emerald-100 text-emerald-800"
    : resilience.band === "Watch" || resilience.band === "Incomplete"
    ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-800";

  const saveReportAccess = async () => {
    setSavingAccess(true);
    setAccessMessage("");
    setAccessError("");
    setAccessLink("");
    try {
      const response = await apiRequest("POST", "/api/report-access-email", {
        sessionToken: getSessionToken(),
        email: accessEmail,
        inputs,
      });
      const data = await response.json();
      setAccessMessage(data.message ?? "Report access link saved.");
      setAccessLink(data.emailSent ? "" : data.reportAccessUrl ?? "");
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : "Could not save report access");
    } finally {
      setSavingAccess(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Your Free Preview — RedundancyCalculatorUK</title>
        <meta name="description" content="Your free redundancy package estimate and runway preview — unlock the full report for stress tests and a plain-English brief." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.redundancycalculatoruk.co.uk/preview" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <DisclaimerBanner />

        <SiteHeader showCta={false} />

        <div className="sticky top-[57px] z-30 flex items-center justify-end gap-2 px-6 py-2 border-b bg-background/95 backdrop-blur flex-wrap">
          <Button variant="outline" size="sm" onClick={() => navigate("/wizard?step=0")} data-testid="button-add-package">
            Add package details
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/wizard")} data-testid="button-edit-inputs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit assumptions
          </Button>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
          <PackageTotalHero inputs={inputs} />

          <StatutoryFreeSummary inputs={inputs} />

          <PreviewIncomeAssumptionsPanel inputs={inputs} />

          <Card className="border-gold/20 bg-[hsl(40_30%_98%)]">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-base font-semibold text-primary mb-2">Statutory redundancy may be only part of the picture</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{WIDER_PACKAGE_TEASER}</p>
            </CardContent>
          </Card>

          <LockedPackagePreviewGrid inputs={inputs} />

          <Card className="border-primary/20 bg-surface" data-testid="card-unlock-cta">
            <CardContent className="pt-8 pb-8 text-center">
              <h3 className="font-display font-semibold text-xl mb-2">{PRODUCT_COPY.unlockHeadline}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                Go beyond the statutory estimate. Model the wider package, see how the payout feeds into your runway, and generate a plain-English brief from your figures.
              </p>
              <ul className="text-xs text-muted-foreground max-w-md mx-auto mb-6 space-y-1.5 text-left">
                {PRODUCT_COPY.unlockModules.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="btn-gold w-full max-w-sm" onClick={() => navigate("/unlock")} data-testid="button-unlock">
                Unlock full report — £{RUNWAY_REPORT_PRICE_GBP}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-muted-foreground mt-4 max-w-sm mx-auto leading-relaxed">
                One-off payment. No subscription. {DASHBOARD_DISCLAIMER}
              </p>
            </CardContent>
          </Card>

          {/* Runway section — demoted below package */}
          <section className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Baseline runway preview</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Under the assumptions entered, your baseline runway is {formatMonths(result.monthsUntilDepletion)} with starting capital of {formatGBP(result.startingCapital)}.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Baseline runway", value: formatMonths(result.monthsUntilDepletion), stripe: chartTheme.color.s1 },
                { label: "Starting capital", value: formatGBP(result.startingCapital), stripe: chartTheme.color.cash },
                { label: "Net monthly burn", value: formatGBP(result.monthlyBurn), stripe: chartTheme.color.attention },
                { label: "RRI score", value: `${resilience.score}/100`, stripe: chartTheme.color.s2 },
              ].map((m) => (
                <div key={m.label} className="bg-white rounded-xl border border-slate-200 border-t-4 shadow-sm px-4 py-4" style={{ borderTopColor: m.stripe }}>
                  <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-1">{m.label}</p>
                  <p className="text-lg font-bold text-[#1a3357] tabular-nums">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 rounded-xl border bg-muted/30 p-4">
              <RriGauge score={resilience.score} size={90} label="Runway Resilience" />
              <div>
                <Badge className={`${stabilityColor} mb-2`}>{resilience.bandLabel} ({resilience.score}/100)</Badge>
                <p className="text-xs text-muted-foreground">
                  {resilience.incomeModelled
                    ? "Full scenario range, stress tests and month-by-month paths are in the paid report."
                    : "Runway is modelled as capital drawdown only. Income recovery paths unlock in the full report."}
                </p>
              </div>
            </div>
          </section>

          {consoleScenarios.length > 0 && composition.length > 0 && (
            <section className="space-y-3" data-testid="section-locked-console">
              <RunwayConsole
                scenarios={consoleScenarios}
                composition={composition}
                locked
                defaultActiveIndex={0}
                onUnlock={() => navigate("/unlock")}
                hideStress
                unlockLabel="Unlock full runway report"
                footerText="Unlock to reveal exact trajectories, stress tests and sensitivity analysis"
              />
            </section>
          )}

          <ScenarioLeaderboard scenarios={leaderboardScenarios} locked onUnlock={() => navigate("/unlock")} />

          <Card data-testid="card-capital-composition">
            <CardContent className="pt-6 pb-6">
              <p className="text-sm font-medium mb-1">Starting capital composition</p>
              <p className="text-xs text-muted-foreground mb-4">How your modelled starting capital is made up under these assumptions.</p>
              <CapitalCompositionChart segments={compositionSegments} />
            </CardContent>
          </Card>

          {essentialComparison.monthlySaving > 0 && (
            <Card data-testid="card-preview-essential-insight">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <Layers className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    If all non-essential spending ({formatGBP(essentialComparison.monthlySaving)}/mo) were removed under these assumptions, the projection would
                    {essentialComparison.extraMonths > 0
                      ? ` extend by approximately ${essentialComparison.extraMonths} months.`
                      : " not extend further."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <PersonalRunwayPreviewGap inputs={inputs} locked />

          <Card className="border-primary/15" data-testid="card-report-access-email">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-3 mb-4">
                <Mail className="w-4 h-4 text-primary shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold">Save report access for another device</p>
                  <p className="text-xs text-muted-foreground mt-1">Add an email to recover your report access link.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                <div>
                  <Label htmlFor="report-access-email" className="text-xs mb-1.5 block">Email address</Label>
                  <Input id="report-access-email" type="email" value={accessEmail} onChange={(e) => setAccessEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <Button variant="outline" onClick={saveReportAccess} disabled={!accessEmail.trim() || savingAccess}>
                  {savingAccess ? "Saving..." : "Save access link"}
                </Button>
              </div>
              {accessMessage && <p className="text-xs text-muted-foreground mt-3">{accessMessage}</p>}
              {accessError && <p className="text-xs text-destructive mt-3">{accessError}</p>}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
