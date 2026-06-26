import { useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgePoundSterling,
  CalendarDays,
  Clock,
  Lock,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatGBP, formatMonths } from "@/lib/engine";
import { buildMaximiserInsights } from "@/lib/position-enhancement/buildMaximiserInsights";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { EXAMPLE_RUNWAY_INPUTS } from "@/lib/private-runway-brief/exampleInputs";
import {
  PRODUCT_COPY,
  REDUNDANCY_PAY_MAXIMISER_NAME,
  RUNWAY_REPORT_PRICE_GBP,
} from "@shared/product";

const LEVER_ICONS = [Clock, CalendarDays, TrendingUp, Wallet] as const;

export function LandingMaximiserFeatureCallout() {
  const packageData = useMemo(() => buildPackageDashboardData(EXAMPLE_RUNWAY_INPUTS), []);
  const insights = useMemo(() => buildMaximiserInsights(EXAMPLE_RUNWAY_INPUTS), []);

  const packageGap = packageData.packageTotal - packageData.estimate.statutoryRedundancy;
  const runwayGap = insights.currentRunwayMonths - insights.statutoryRunwayMonths;
  const topOpps = insights.rankedOpportunities.slice(0, 3);
  const copy = PRODUCT_COPY.maximiserLanding;

  return (
    <section
      className="mb-8 rounded-2xl border-2 border-gold/40 overflow-hidden shadow-lg bg-gradient-to-br from-[hsl(220_52%_14%)] via-[hsl(220_52%_20%)] to-[hsl(220_52%_16%)]"
      data-testid="landing-maximiser-feature"
    >
      <div className="px-5 sm:px-6 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold shrink-0" />
          <p className="text-[10px] uppercase tracking-widest text-gold font-semibold">{copy.eyebrow}</p>
          <Badge className="bg-gold/20 text-gold border-gold/35 text-[10px]">{REDUNDANCY_PAY_MAXIMISER_NAME}</Badge>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] text-white/70">
          <Lock className="w-3 h-3 text-gold" />
          Unlocks with paid report
        </div>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-5">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug mb-2">{copy.headline}</h3>
            <p className="text-sm text-white/65 leading-relaxed">{copy.subheadline}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-center">
              <p className="text-[9px] uppercase tracking-wide text-white/45 mb-1">{copy.statutoryOnlyLabel}</p>
              <p className="text-base sm:text-lg font-bold text-white tabular-nums">
                {formatGBP(packageData.estimate.statutoryRedundancy)}
              </p>
            </div>
            <div className="rounded-lg border border-gold/35 bg-gold/10 px-3 py-3 text-center">
              <p className="text-[9px] uppercase tracking-wide text-gold/80 mb-1">{copy.fullPackageLabel}</p>
              <p className="text-base sm:text-lg font-bold text-gold tabular-nums">
                {formatGBP(packageData.packageTotal)}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-3 text-center">
              <p className="text-[9px] uppercase tracking-wide text-emerald-200/70 mb-1">{copy.runwayDeltaLabel}</p>
              <p className="text-base sm:text-lg font-bold text-emerald-200 tabular-nums">
                +{formatMonths(runwayGap > 0 ? runwayGap : 0)}
              </p>
            </div>
          </div>

          {packageGap > 0 && (
            <p className="text-sm text-white/80">
              <BadgePoundSterling className="w-4 h-4 inline-block mr-1 text-gold align-text-bottom" />
              Sample model:{" "}
              <span className="font-semibold text-gold tabular-nums">{formatGBP(packageGap)}</span> above statutory when
              notice, holiday and enhancement are included — each line needs HR verification.
            </p>
          )}

          <ul className="space-y-2.5">
            {copy.levers.map((lever, i) => {
              const Icon = LEVER_ICONS[i] ?? TrendingUp;
              return (
                <li key={lever.title} className="flex items-start gap-2.5 text-sm">
                  <div className="w-7 h-7 rounded-md bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-white/90">{lever.title}</p>
                    <p className="text-xs text-white/55 leading-relaxed">{lever.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-white/12 bg-white/[0.06] backdrop-blur-sm p-4 sm:p-5 flex flex-col">
          <p className="text-[10px] uppercase tracking-widest text-gold/90 font-semibold mb-3">{copy.ladderTitle}</p>

          <ul className="space-y-2 flex-1">
            {topOpps.map((opp) => (
              <li
                key={opp.itemKey}
                className="rounded-lg border border-white/15 bg-white/95 px-3 py-2.5 flex flex-wrap items-center gap-2"
              >
                <span className="w-6 h-6 rounded-full bg-primary/10 text-[10px] font-bold text-primary flex items-center justify-center shrink-0">
                  {opp.rank}
                </span>
                <span className="text-xs font-medium text-foreground flex-1 min-w-[140px]">{opp.label}</span>
                {opp.packageUplift != null && opp.packageUplift > 0 && (
                  <span className="text-xs font-bold text-emerald-700 tabular-nums">+{formatGBP(opp.packageUplift)}</span>
                )}
                {opp.runwayUpliftMonths != null && opp.runwayUpliftMonths > 0 && (
                  <span className="text-xs font-semibold text-primary tabular-nums">
                    +{formatMonths(opp.runwayUpliftMonths)}
                  </span>
                )}
                {(opp.packageUplift == null || opp.packageUplift === 0) && (
                  <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200/60 rounded px-1.5 py-0.5">
                    Check this line
                  </span>
                )}
              </li>
            ))}

            {["Payout scenario comparison", "Consultation leverage points", "Missing money checklist"].map((label) => (
              <li
                key={label}
                className="relative rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 overflow-hidden"
              >
                <div className="flex items-center gap-2 blur-[3px] select-none pointer-events-none opacity-60">
                  <span className="w-6 h-6 rounded-full bg-white/10" />
                  <span className="text-xs text-white/70">{label}</span>
                  <span className="text-xs text-emerald-300 ml-auto">+£—</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-gold/80" />
                </div>
              </li>
            ))}
          </ul>

          <p className="text-[11px] text-white/50 leading-relaxed mt-4 mb-4">{copy.ladderLocked}</p>

          <Link href="/unlock" className="mt-auto">
            <Button className="btn-gold w-full sm:w-auto" data-testid="button-maximiser-feature-unlock">
              Unlock {REDUNDANCY_PAY_MAXIMISER_NAME} — £{RUNWAY_REPORT_PRICE_GBP}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
