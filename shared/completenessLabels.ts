/** Human-readable labels for package model completeness fields. */
export const COMPLETENESS_FIELD_LABELS: Record<string, string> = {
  statutory: "Weekly gross pay",
  enhanced: "Enhanced / employer package",
  notice: "Notice period",
  holiday: "Holiday accrued",
  wages: "Unpaid wages",
  bonus: "Other one-off income",
  manual: "Manual package override",
  savings: "Cash or liquid savings",
  income_gap: "Job gap or replacement income",
  essentials: "Essential household costs",
};

export function labelCompletenessField(key: string): string {
  return COMPLETENESS_FIELD_LABELS[key] ?? key;
}
