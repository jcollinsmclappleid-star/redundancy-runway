import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { REDUNDANCY_PAY_MAXIMISER_NAME } from "@shared/product";
import { POSITION_ENHANCEMENT_DISCLAIMER } from "@shared/complianceCopy";
import type { PositionEnhancementData, MaximiserBucket } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { formatGBP } from "@/lib/engine";
import { PositionModulePanel } from "./PositionModulePanel";

const BUCKET_LABELS: Record<MaximiserBucket, string> = {
  alreadyIncluded: "Already included",
  notYetIncluded: "Not yet included",
  couldIncreaseTotal: "Could increase the total",
  needsChecking: "Needs checking",
  highValueToClarify: "High-value components to clarify",
};

interface RedundancyPackageMaximiserProps {
  data: PositionEnhancementData;
}

export function RedundancyPackageMaximiser({ data }: RedundancyPackageMaximiserProps) {
  const [, navigate] = useLocation();
  const buckets: MaximiserBucket[] = [
    "alreadyIncluded",
    "notYetIncluded",
    "couldIncreaseTotal",
    "needsChecking",
    "highValueToClarify",
  ];

  return (
    <PositionModulePanel
      title={REDUNDANCY_PAY_MAXIMISER_NAME}
      subtitle="See which components could increase the package total before you rely on the headline figure."
      testId="module-package-maximiser"
      disclaimer={POSITION_ENHANCEMENT_DISCLAIMER}
    >
      <div className="space-y-6">
        {buckets.map((bucket) => {
          const items = data.maximiser[bucket];
          if (items.length === 0) return null;
          return (
            <div key={bucket}>
              <p className="text-sm font-semibold text-primary mb-2">{BUCKET_LABELS[bucket]}</p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.itemKey} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      {item.amount != null && item.amount > 0 && (
                        <p className="text-sm font-semibold tabular-nums shrink-0">{formatGBP(item.amount)}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.message}</p>
                    {(bucket === "couldIncreaseTotal" || bucket === "notYetIncluded" || bucket === "highValueToClarify") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => navigate(`/wizard?step=${item.wizardStep}`)}
                      >
                        Add or check this figure
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PositionModulePanel>
  );
}
