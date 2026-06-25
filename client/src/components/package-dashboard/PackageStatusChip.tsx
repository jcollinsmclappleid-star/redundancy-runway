import type { PackageComponentStatus } from "@/lib/package-dashboard/buildPackageDashboardData";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<PackageComponentStatus, string> = {
  entered: "Entered",
  missing: "Not entered",
  not_applicable: "N/A",
  manual_estimate: "Manual estimate",
};

const STATUS_CLS: Record<PackageComponentStatus, string> = {
  entered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  missing: "bg-slate-50 text-slate-600 border-slate-200",
  not_applicable: "bg-slate-50 text-slate-500 border-slate-200",
  manual_estimate: "bg-amber-50 text-amber-800 border-amber-200",
};

export function PackageStatusChip({ status }: { status: PackageComponentStatus }) {
  return (
    <Badge variant="outline" className={`text-[10px] font-medium ${STATUS_CLS[status]}`}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function ChecklistStatusChip({
  status,
}: {
  status: "entered" | "not_entered" | "not_applicable" | "verify";
}) {
  const labels = {
    entered: "Entered",
    not_entered: "Not entered",
    not_applicable: "N/A",
    verify: "Verify",
  };
  const cls = {
    entered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    not_entered: "bg-slate-50 text-slate-600 border-slate-200",
    not_applicable: "bg-slate-50 text-slate-500 border-slate-200",
    verify: "bg-amber-50 text-amber-800 border-amber-200",
  };
  return (
    <Badge variant="outline" className={`text-[10px] font-medium ${cls[status]}`}>
      {labels[status]}
    </Badge>
  );
}
