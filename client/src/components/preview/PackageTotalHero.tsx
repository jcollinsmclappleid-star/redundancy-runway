import type { RunwayInputs } from "@shared/schema";
import { useLocation } from "wouter";
import { Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP } from "@/lib/engine";
import { FREE_STATUTORY_BOUNDARY, PACKAGE_DISCLAIMER } from "@shared/complianceCopy";

interface PackageTotalHeroProps {
  inputs: RunwayInputs;
  showCta?: boolean;
}

export function PackageTotalHero({ inputs, showCta = true }: PackageTotalHeroProps) {
  const [, navigate] = useLocation();
  const data = buildPackageDashboardData(inputs);
  const est = data.estimate;
  const pkg = inputs.redundancyPackage;

  const breakdownRows = [
    pkg.enhancedPackage && pkg.enhancedAmount > 0
      ? {
          label: "Enhanced / employer package",
          value: pkg.enhancedAmount,
          testId: "text-hero-enhanced",
        }
      : est.qualifyingServiceMet && {
          label: "Statutory redundancy",
          value: est.statutoryRedundancy,
          testId: "text-hero-statutory",
        },
    pkg.useManualOverride && pkg.manualOverrideAmount > 0 && {
      label: "Manual package override",
      value: pkg.manualOverrideAmount,
      testId: "text-hero-manual",
    },
    {
      label: "Notice pay / PILON",
      value: est.noticePay,
      testId: "text-hero-notice",
    },
    {
      label: "Holiday pay",
      value: est.holidayPay,
      testId: "text-hero-holiday",
    },
  ].filter((row): row is { label: string; value: number; testId: string } => Boolean(row));

  return (
    <section
      className="rounded-2xl bg-gradient-to-br from-primary via-[hsl(220_52%_22%)] to-[hsl(220_52%_16%)] text-white px-6 py-8"
      data-testid="section-package-total-hero"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
          <Check className="w-3 h-3" /> Free estimate
        </span>
        <Badge variant="secondary" className="bg-gold/15 text-gold border-gold/30">
          Package total
        </Badge>
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-2">
        Your estimated redundancy package
      </h1>
      <p className="text-4xl md:text-5xl font-bold tabular-nums text-gold mb-1" data-testid="text-package-total-hero">
        {formatGBP(data.packageTotal)}
      </p>
      {est.qualifyingServiceMet && est.statutoryRedundancy > 0 && est.statutoryRedundancy < data.packageTotal && (
        <p className="text-sm text-white/60 mb-4">
          Includes statutory estimate of {formatGBP(est.statutoryRedundancy)}
        </p>
      )}

      <div className="rounded-xl bg-white/10 border border-white/15 p-4 mb-4 space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Breakdown</p>
        {breakdownRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-white/70 text-xs">{row.label}</span>
            <span className="font-semibold tabular-nums" data-testid={row.testId}>
              {row.value > 0 ? formatGBP(row.value) : "—"}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 text-sm pt-2 border-t border-white/15">
          <span className="text-white/90 text-xs font-medium">Estimated total package</span>
          <span className="font-bold tabular-nums text-gold">{formatGBP(data.packageTotal)}</span>
        </div>
      </div>

      <p className="text-white/55 text-xs max-w-xl leading-relaxed mb-4">
        {FREE_STATUTORY_BOUNDARY} {PACKAGE_DISCLAIMER}
      </p>

      {showCta && (
        <Button className="btn-gold" onClick={() => navigate("/wizard?step=0")} data-testid="button-hero-edit-package">
          Edit package assumptions
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </section>
  );
}
