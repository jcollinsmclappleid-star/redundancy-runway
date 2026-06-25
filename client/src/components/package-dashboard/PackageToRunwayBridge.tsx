import type { RunwayInputs } from "@shared/schema";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP, formatMonths } from "@/lib/engine";
import { ArrowRight } from "lucide-react";
import { DASHBOARD_DISCLAIMER } from "@shared/complianceCopy";

export function PackageToRunwayBridge({ inputs }: { inputs: RunwayInputs }) {
  const { bridge } = buildPackageDashboardData(inputs);

  const steps = [
    { label: "Package in model", value: formatGBP(bridge.packageTotal), sub: "Redundancy package assumption" },
    { label: "Savings & investments", value: formatGBP(bridge.savingsAndInvestments), sub: "If entered" },
    { label: "Starting capital", value: formatGBP(bridge.startingCapital), sub: "Money entering the model" },
    { label: "Net monthly burn", value: formatGBP(bridge.netMonthlyBurn), sub: "Monthly pressure" },
    { label: "Baseline runway", value: formatMonths(bridge.baselineRunwayMonths), sub: "Estimated runway" },
    { label: "Severe case", value: formatMonths(bridge.severeRunwayMonths), sub: "Zero-income scenario" },
  ];

  return (
    <DashboardPanel
      title="From payout to runway"
      subtitle="The package figure is only the starting point. The runway model shows how long it may last under the assumptions entered."
      testId="dashboard-package-bridge"
      footer={DASHBOARD_DISCLAIMER}
    >
      <div className="hidden sm:flex items-stretch gap-1 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1 shrink-0">
            <div className="rounded-xl border border-gold/20 bg-[hsl(40_30%_98%)] px-4 py-3 min-w-[120px]">
              <p className="text-[9px] uppercase text-muted-foreground mb-1">{s.label}</p>
              <p className="text-lg font-bold text-primary tabular-nums">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>
            </div>
            {i < steps.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>
      <div className="sm:hidden grid grid-cols-2 gap-2">
        {steps.map((s) => (
          <div key={s.label} className="rounded-xl border border-gold/20 bg-[hsl(40_30%_98%)] px-3 py-2">
            <p className="text-[9px] uppercase text-muted-foreground">{s.label}</p>
            <p className="text-base font-bold text-primary tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
