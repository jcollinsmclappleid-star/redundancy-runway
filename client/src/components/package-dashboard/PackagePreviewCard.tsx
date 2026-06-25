import type { RunwayInputs } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP } from "@/lib/engine";
import { PACKAGE_DISCLAIMER } from "@shared/complianceCopy";

/** Reusable package estimate card for preview / unlock. */
export function PackagePreviewCard({ inputs }: { inputs: RunwayInputs }) {
  const data = buildPackageDashboardData(inputs);

  return (
    <Card data-testid="card-preview-redundancy-estimate" className="border-primary/20">
      <CardContent className="pt-5 pb-5">
        <p className="text-sm font-semibold mb-0.5">Your redundancy package estimate</p>
        <p className="text-xs text-muted-foreground mb-4">Based on the package assumptions entered</p>
        <div className="space-y-2">
          {data.estimate.qualifyingServiceMet ? (
            <div className="flex items-center justify-between text-sm gap-2">
              <span className="text-muted-foreground text-xs">Estimated statutory redundancy</span>
              <span className="font-semibold tabular-nums" data-testid="text-statutory-redundancy">
                {formatGBP(data.estimate.statutoryRedundancy)}
              </span>
            </div>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 rounded p-2">
              Under these assumptions, fewer than 2 years&apos; service — statutory redundancy estimate is £0.
            </div>
          )}
          <div className="flex items-center justify-between text-sm gap-2">
            <span className="text-muted-foreground text-xs">Notice pay / PILON assumption</span>
            <span className="font-semibold tabular-nums" data-testid="text-notice-pay">
              {formatGBP(data.estimate.noticePay)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm gap-2">
            <span className="text-muted-foreground text-xs">Holiday pay</span>
            <span className="font-semibold tabular-nums" data-testid="text-holiday-pay">
              {formatGBP(data.estimate.holidayPay)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm gap-2 pt-2 border-t">
            <span className="text-xs font-medium">Estimated total package</span>
            <span className="font-bold text-base tabular-nums" data-testid="text-total-package">
              {formatGBP(data.packageTotal)}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">{PACKAGE_DISCLAIMER}</p>
      </CardContent>
    </Card>
  );
}
