import { SELECTION_CRITERIA_DISCLAIMER } from "@shared/complianceCopy";
import type { PositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { PositionModulePanel } from "./PositionModulePanel";

interface SelectionCriteriaPrepProps {
  data: PositionEnhancementData;
}

export function SelectionCriteriaPrep({ data }: SelectionCriteriaPrepProps) {
  return (
    <PositionModulePanel
      title="Selection Criteria Prep"
      subtitle="Prepare evidence against common redundancy selection factors."
      testId="module-selection-criteria"
      disclaimer={SELECTION_CRITERIA_DISCLAIMER}
    >
      <div className="space-y-3">
        {data.selectionCriteria.map((c) => (
          <div key={c.criteriaKey} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-3">
            <p className="text-sm font-semibold text-primary mb-1">{c.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              <span className="font-medium text-foreground">Evidence: </span>
              {c.evidence}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Ask: </span>
              {c.question}
            </p>
          </div>
        ))}
      </div>
    </PositionModulePanel>
  );
}
