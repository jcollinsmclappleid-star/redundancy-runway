import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { POSITION_ENHANCEMENT_DISCLAIMER } from "@shared/complianceCopy";
import type { PositionEnhancementData, MissingMoneyStatus } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { formatGBP } from "@/lib/engine";
import { PositionModulePanel } from "./PositionModulePanel";

const STATUS_LABELS: Record<MissingMoneyStatus, string> = {
  included: "Included",
  missing: "Missing",
  unclear: "Unclear",
  not_applicable: "N/A",
};

const STATUS_CLS: Record<MissingMoneyStatus, string> = {
  included: "bg-emerald-50 text-emerald-700 border-emerald-200",
  missing: "bg-amber-50 text-amber-800 border-amber-200",
  unclear: "bg-slate-50 text-slate-600 border-slate-200",
  not_applicable: "bg-slate-50 text-slate-500 border-slate-200",
};

interface MissingMoneyChecklistProps {
  data: PositionEnhancementData;
}

export function MissingMoneyChecklist({ data }: MissingMoneyChecklistProps) {
  const [, navigate] = useLocation();

  return (
    <PositionModulePanel
      title="Missing money checklist"
      subtitle="Common package components people forget to include in their model."
      testId="module-missing-money"
      disclaimer={POSITION_ENHANCEMENT_DISCLAIMER}
    >
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        These items can change the total package picture if they apply to your situation.
      </p>
      <div className="space-y-2">
        {data.missingMoney.map((item) => (
          <div key={item.itemKey} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-primary">{item.label}</p>
              <Badge variant="outline" className={`text-[10px] font-medium ${STATUS_CLS[item.status]}`}>
                {STATUS_LABELS[item.status]}
              </Badge>
            </div>
            {item.amount != null && item.amount > 0 && (
              <p className="text-sm font-semibold tabular-nums mb-1">{formatGBP(item.amount)}</p>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed mb-1">{item.whyItMatters}</p>
            <p className="text-[10px] text-slate-500 mb-2">
              Where to check: <span className="text-foreground">{item.whereToCheck}</span>
            </p>
            {(item.status === "missing" || item.status === "unclear") && (
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
    </PositionModulePanel>
  );
}
