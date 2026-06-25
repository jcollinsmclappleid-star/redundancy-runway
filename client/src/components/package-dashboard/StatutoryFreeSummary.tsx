import type { RunwayInputs } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP, UK_STATUTORY_REDUNDANCY } from "@/lib/engine";
import { FREE_STATUTORY_BOUNDARY, PACKAGE_DISCLAIMER } from "@shared/complianceCopy";

export function StatutoryFreeSummary({ inputs }: { inputs: RunwayInputs }) {
  const data = buildPackageDashboardData(inputs);
  const pkg = inputs.redundancyPackage;

  return (
    <Card className="border-primary/25 border-t-4 border-t-primary" data-testid="statutory-free-summary">
      <CardContent className="pt-6 pb-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Age entered</p>
            <p className="text-lg font-bold tabular-nums">{pkg.age || "—"}</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Years of service</p>
            <p className="text-lg font-bold tabular-nums">{pkg.yearsOfService || "—"}</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Weekly pay used</p>
            <p className="text-lg font-bold tabular-nums">{pkg.weeklyGrossPay > 0 ? formatGBP(data.cappedWeeklyPay) : "—"}</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-[9px] uppercase text-muted-foreground mb-1">Cap applied</p>
            <p className="text-sm font-semibold">
              {pkg.weeklyGrossPay > UK_STATUTORY_REDUNDANCY.weeklyPayCap
                ? `Yes (${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)}/wk)`
                : pkg.weeklyGrossPay > 0
                  ? "No"
                  : "—"}
            </p>
          </div>
        </div>

        {data.statutoryBands.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Age-band breakdown</p>
            {data.statutoryBands.map((b) => (
              <div key={b.label} className="flex justify-between text-xs rounded-lg border border-slate-100 px-3 py-2">
                <span className="text-muted-foreground">{b.label}</span>
                <span className="font-semibold tabular-nums">{b.weeks} wk → {formatGBP(b.amount)}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed border-t pt-3">
          {FREE_STATUTORY_BOUNDARY} {PACKAGE_DISCLAIMER}
        </p>
      </CardContent>
    </Card>
  );
}
