import type { RunwayInputs } from "@shared/schema";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { COMPLETENESS_DISCLAIMER } from "@shared/complianceCopy";
import { labelCompletenessField } from "@shared/completenessLabels";

interface PackageCompletenessScoreProps {
  inputs: RunwayInputs;
  compact?: boolean;
  /** Show named missing fields (preview / conversion). */
  showMissingLabels?: boolean;
}

const BAND_CLS = {
  limited: "bg-slate-100 text-slate-700 border-slate-200",
  partial: "bg-amber-50 text-amber-800 border-amber-200",
  strong: "bg-emerald-50 text-emerald-800 border-emerald-200",
  detailed: "bg-primary/10 text-primary border-primary/20",
};

export function PackageCompletenessScore({
  inputs,
  compact = false,
  showMissingLabels = false,
}: PackageCompletenessScoreProps) {
  const { completeness } = buildPackageDashboardData(inputs);
  const missingLabels = completeness.missingKeys.map(labelCompletenessField);

  return (
    <div
      className={`rounded-xl border p-4 ${compact ? "" : "mb-4"}`}
      data-testid="package-completeness-score"
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-sm font-semibold text-primary">Package completeness</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completeness.enteredCount} of {completeness.applicableCount} model fields entered
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold tabular-nums text-primary">{completeness.percent}%</p>
          <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border mt-1 ${BAND_CLS[completeness.band]}`}>
            {completeness.bandLabel}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${completeness.percent}%` }}
        />
      </div>
      {showMissingLabels && missingLabels.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-medium text-foreground/80 mb-1">Not yet in the model</p>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {missingLabels.slice(0, 5).map((label) => (
              <li key={label} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                {label}
              </li>
            ))}
            {missingLabels.length > 5 && (
              <li className="text-muted-foreground/80">+ {missingLabels.length - 5} more</li>
            )}
          </ul>
        </div>
      )}
      {!compact && !showMissingLabels && completeness.missingKeys.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Some figures are not yet included in the model. Add package or runway assumptions to build a fuller picture.
        </p>
      )}
      <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">{COMPLETENESS_DISCLAIMER}</p>
    </div>
  );
}
