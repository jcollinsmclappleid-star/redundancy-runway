import type { RunwayInputs } from "@shared/schema";
import { useLocation } from "wouter";
import { Check, ArrowRight, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP } from "@/lib/engine";
import { FREE_STATUTORY_BOUNDARY, PACKAGE_DISCLAIMER } from "@shared/complianceCopy";
import { PRODUCT_COPY, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";

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
          <Check className="w-3 h-3" /> Free preview
        </span>
        <Badge variant="secondary" className="bg-gold/15 text-gold border-gold/30">
          Package estimate
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

      {showCta && (
        <div
          className="rounded-xl border border-gold/35 bg-gold/10 p-4 sm:p-5 mb-4"
          data-testid="panel-hero-unlock-sell"
        >
          <div className="flex items-start gap-2 mb-2">
            <Shield className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold/90 font-semibold mb-1">
                Full private report
              </p>
              <h2 className="text-base sm:text-lg font-semibold leading-snug text-white">
                {PRODUCT_COPY.previewUnlockHeadline}
              </h2>
            </div>
          </div>
          <p className="text-sm text-white/75 leading-relaxed mb-4">
            {PRODUCT_COPY.previewUnlockSub}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {PRODUCT_COPY.previewUnlockAngles.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-0.5 rounded-lg bg-white/8 border border-white/10 px-3 py-2.5"
                data-testid={`hero-unlock-angle-${item.id}`}
              >
                <p className="text-xs font-semibold text-gold leading-snug">{item.title}</p>
                <p className="text-[10px] text-white/65 leading-snug">{item.desc}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            <Button
              className="btn-gold whitespace-normal h-auto min-h-10 py-2.5 flex-1 sm:flex-none"
              onClick={() => navigate("/unlock")}
              data-testid="button-hero-unlock"
            >
              <span className="sm:hidden">{PRODUCT_COPY.unlockCtaMobile}</span>
              <span className="hidden sm:inline">{PRODUCT_COPY.unlockCta}</span>
              <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white whitespace-normal h-auto min-h-10 py-2.5"
              onClick={() => navigate("/wizard?step=0")}
              data-testid="button-hero-edit-package"
            >
              Refine package assumptions
            </Button>
          </div>
          <p className="text-[10px] text-white/50 mt-3">
            £{RUNWAY_REPORT_PRICE_GBP} one-off · 6 months access · {PRODUCT_COPY.unlockSupportingLine}
          </p>
        </div>
      )}

      <p className="text-white/55 text-xs max-w-xl leading-relaxed">
        {FREE_STATUTORY_BOUNDARY} {PACKAGE_DISCLAIMER}
      </p>
    </section>
  );
}
