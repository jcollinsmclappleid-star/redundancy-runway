import type { RunwayInputs } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP, formatMonths } from "@/lib/engine";
import { OFFER_COMPARISON_DISCLAIMER, DASHBOARD_DISCLAIMER } from "@shared/complianceCopy";

export function RedundancyOfferComparisonDashboard({ inputs }: { inputs: RunwayInputs }) {
  const { offerComparison: o, components } = buildPackageDashboardData(inputs);
  const included = components.filter((c) => c.status === "entered" || c.status === "manual_estimate");
  const excluded = components.filter((c) => c.status === "missing");

  return (
    <DashboardPanel
      title="Statutory vs employer package assumptions"
      subtitle={OFFER_COMPARISON_DISCLAIMER}
      testId="dashboard-offer-comparison"
      footer={DASHBOARD_DISCLAIMER}
    >
      {!o.hasEmployerOffer ? (
        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
          <p className="text-sm font-medium mb-2">Have you received an employer package figure?</p>
          <p className="text-xs text-muted-foreground mb-4">
            Add an enhanced or manual package assumption in the wizard to compare against the statutory estimate.
          </p>
          <Link href="/wizard">
            <Button size="sm" variant="outline">
              Add employer package assumption
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-[10px] uppercase text-muted-foreground mb-1">Statutory estimate</p>
              <p className="text-xl font-bold text-primary tabular-nums">{formatGBP(o.statutoryEstimate)}</p>
            </div>
            <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-center">
              <p className="text-[10px] uppercase text-muted-foreground mb-1">Employer / manual offer</p>
              <p className="text-xl font-bold text-primary tabular-nums">{formatGBP(o.employerOffer)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-[10px] uppercase text-muted-foreground mb-1">Difference</p>
              <p className="text-xl font-bold tabular-nums text-amber-800">
                {o.difference >= 0 ? "+" : ""}
                {formatGBP(o.difference)}
              </p>
              {o.upliftPercent != null && (
                <p className="text-[10px] text-muted-foreground mt-1">{o.upliftPercent}% vs statutory</p>
              )}
            </div>
          </div>
          {o.extraRunwayMonths != null && (
            <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm">
              <p className="font-semibold text-primary mb-1">Runway bridge (model scenario)</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Under the assumptions entered, the offer difference may change baseline runway by approximately{" "}
                {formatMonths(Math.abs(o.extraRunwayMonths))} compared with the statutory-only package path. Not a prediction.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
              <p className="font-semibold text-emerald-900 mb-2">Included in model</p>
              <ul className="space-y-1 text-muted-foreground">
                {included.length > 0 ? (
                  included.map((c) => (
                    <li key={c.itemKey}>
                      {c.label}
                      {c.amount != null && c.amount > 0 ? ` — ${formatGBP(c.amount)}` : ""}
                    </li>
                  ))
                ) : (
                  <li>Statutory estimate only</li>
                )}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
              <p className="font-semibold text-slate-800 mb-2">Not yet included</p>
              <ul className="space-y-1 text-muted-foreground">
                {excluded.length > 0 ? (
                  excluded.map((c) => <li key={c.itemKey}>{c.label}</li>)
                ) : (
                  <li>All applicable components entered</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </DashboardPanel>
  );
}
