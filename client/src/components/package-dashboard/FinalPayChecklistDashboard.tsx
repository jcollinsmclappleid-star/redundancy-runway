import type { RunwayInputs } from "@shared/schema";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { ChecklistStatusChip } from "./PackageStatusChip";
import { DASHBOARD_DISCLAIMER } from "@shared/complianceCopy";

export function FinalPayChecklistDashboard({ inputs }: { inputs: RunwayInputs }) {
  const { checklist } = buildPackageDashboardData(inputs);

  return (
    <DashboardPanel
      title="Final pay components to check"
      subtitle="Figures that may need verification before relying on the model. Not advice — a checklist of assumptions to confirm."
      testId="dashboard-final-pay-checklist"
      footer={DASHBOARD_DISCLAIMER}
    >
      <div className="space-y-2">
        {checklist.map((item) => (
          <div key={item.itemKey} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-primary">{item.label}</p>
              <ChecklistStatusChip status={item.status} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-1">{item.whyItMatters}</p>
            <p className="text-[10px] text-slate-500">
              Where to check: <span className="text-foreground">{item.whereToCheck}</span>
            </p>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
