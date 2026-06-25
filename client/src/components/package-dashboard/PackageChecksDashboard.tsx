import type { RunwayInputs } from "@shared/schema";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { ChecklistStatusChip } from "./PackageStatusChip";
import { DASHBOARD_DISCLAIMER, PACKAGE_VERIFY_QUESTIONS } from "@shared/complianceCopy";
import { formatGBP } from "@/lib/engine";

interface PackageChecksDashboardProps {
  inputs: RunwayInputs;
}

export function PackageChecksDashboard({ inputs }: PackageChecksDashboardProps) {
  const { checklist } = buildPackageDashboardData(inputs);
  const pkg = inputs.redundancyPackage;
  const estimate = buildPackageDashboardData(inputs).estimate;

  const amounts: Record<string, number | null> = {
    statutory: estimate.statutoryRedundancy,
    enhanced: pkg.enhancedAmount > 0 ? pkg.enhancedAmount : null,
    notice: estimate.noticePay,
    holiday: estimate.holidayPay,
    wages: inputs.unpaidWages ?? null,
    bonus: inputs.otherOneOffIncome > 0 ? inputs.otherOneOffIncome : null,
  };

  return (
    <DashboardPanel
      title="Package checks before relying on the figure"
      subtitle="Identify which figures have been entered, which are missing from the model, and which may need verification."
      testId="dashboard-package-checks"
      footer={DASHBOARD_DISCLAIMER}
    >
      <div className="space-y-2 mb-6">
        {checklist.map((item) => (
          <div key={item.itemKey} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-primary">{item.label}</p>
              <ChecklistStatusChip status={item.status} />
            </div>
            {amounts[item.itemKey] != null && amounts[item.itemKey]! > 0 && (
              <p className="text-sm font-semibold tabular-nums mb-1">{formatGBP(amounts[item.itemKey]!)}</p>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed mb-1">{item.whyItMatters}</p>
            <p className="text-[10px] text-slate-500">
              Where to check: <span className="text-foreground">{item.whereToCheck}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
        <p className="text-sm font-semibold text-primary mb-2">Questions to verify before relying on the figure</p>
        <ul className="space-y-2">
          {PACKAGE_VERIFY_QUESTIONS.map((q) => (
            <li key={q} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
              <span className="text-primary shrink-0">·</span>
              {q}
            </li>
          ))}
        </ul>
      </div>
    </DashboardPanel>
  );
}
