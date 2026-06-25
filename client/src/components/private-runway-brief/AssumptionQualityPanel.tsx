import { CheckCircle2, AlertCircle, HelpCircle, MinusCircle } from "lucide-react";
import type { BriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import type { AssumptionQualityItem } from "@/lib/private-runway-brief/buildAssumptionQuality";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";

function StatusIcon({ status }: { status: AssumptionQualityItem["status"] }) {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />;
    case "partial":
      return <MinusCircle className="w-4 h-4 text-amber-600 shrink-0" />;
    case "missing":
      return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
    case "uncertain":
      return <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />;
  }
}

const STATUS_LABELS: Record<AssumptionQualityItem["status"], string> = {
  complete: "Complete",
  partial: "Partial",
  missing: "Missing",
  uncertain: "User uncertain",
};

interface AssumptionQualityPanelProps {
  dashboard: BriefDashboardData;
  narrative: PrivateRunwayBriefNarrative;
}

export function AssumptionQualityPanel({ dashboard, narrative }: AssumptionQualityPanelProps) {
  const checkMap = new Map(
    narrative.assumptionsCommentary.itemsToCheck.map((c) => [c.inputKey, c.whyItMatters]),
  );

  return (
    <DashboardPanel
      title="Assumption quality"
      subtitle={narrative.assumptionsCommentary.confidenceSummary}
      testId="brief-assumption-quality"
    >
      <div className="space-y-2">
        {dashboard.assumptionQuality.map((item) => (
          <div
            key={item.inputKey}
            className="flex items-start gap-3 p-3 rounded-lg border border-gold/10 bg-white"
          >
            <StatusIcon status={item.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{item.label}</p>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                  {STATUS_LABELS[item.status]}
                </span>
              </div>
              {item.note && <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>}
              {checkMap.get(item.inputKey) && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{checkMap.get(item.inputKey)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
