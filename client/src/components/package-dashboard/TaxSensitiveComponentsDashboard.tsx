import type { RunwayInputs } from "@shared/schema";
import { Link } from "wouter";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP } from "@/lib/engine";
import { PackageStatusChip } from "./PackageStatusChip";
import { TAX_SENSITIVE_DISCLAIMER, DASHBOARD_DISCLAIMER } from "@shared/complianceCopy";

const TAX_LABELS: Record<string, string> = {
  usually_separate: "Usually treated separately",
  may_be_taxable: "May be taxable",
  check_treatment: "Check treatment",
  included_as_entered: "Included in model as entered",
};

export function TaxSensitiveComponentsDashboard({ inputs }: { inputs: RunwayInputs }) {
  const { taxSensitive } = buildPackageDashboardData(inputs);

  return (
    <DashboardPanel
      title="Tax-sensitive package split"
      subtitle={TAX_SENSITIVE_DISCLAIMER}
      testId="dashboard-tax-sensitive"
      footer={DASHBOARD_DISCLAIMER}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {taxSensitive.map((c) => (
          <div key={c.itemKey} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold">{c.label}</p>
              {c.taxLabel && (
                <span className="text-[9px] uppercase font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 shrink-0">
                  {TAX_LABELS[c.taxLabel]}
                </span>
              )}
            </div>
            <p className="text-lg font-bold tabular-nums mb-1">
              {c.amount != null && c.amount > 0 ? formatGBP(c.amount) : "—"}
            </p>
            <PackageStatusChip status={c.status} />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Model package assumptions only.{" "}
        <Link href="/redundancy-tax-calculator" className="text-primary underline">
          Redundancy tax calculator
        </Link>{" "}
        · Check with payroll, HMRC guidance or a qualified tax professional.
      </p>
    </DashboardPanel>
  );
}
