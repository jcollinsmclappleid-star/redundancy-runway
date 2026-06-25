import { Card, CardContent } from "@/components/ui/card";
import type { BriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { SensitivityTornado } from "@/components/charts/sensitivity-tornado";
import { formatMonths } from "@/lib/engine";

interface SensitivityDriversPanelProps {
  dashboard: BriefDashboardData;
  narrative: PrivateRunwayBriefNarrative;
}

export function SensitivityDriversPanel({ dashboard, narrative }: SensitivityDriversPanelProps) {
  const commentMap = new Map(
    narrative.sensitivityCommentary.driverComments.map((c) => [c.driverKey, c.explanation]),
  );

  const tornadoItems = dashboard.sensitivity.map((s) => ({
    label: s.factor,
    baseRunway: s.baseRunway,
    adjustedRunway: s.adjustedRunway,
    difference: s.differenceMonths,
  }));

  return (
    <DashboardPanel
      title="Sensitivity drivers"
      subtitle={narrative.sensitivityCommentary.summary}
      testId="brief-sensitivity-drivers"
    >
      <SensitivityTornado items={tornadoItems} />
      <div className="grid gap-3 mt-5 sm:grid-cols-2">
        {dashboard.sensitivity.slice(0, 6).map((s, i) => (
          <Card key={s.driverKey} className="border border-gold/10 bg-white rounded-lg">
            <CardContent className="py-3 px-4">
              <div className="flex gap-2 items-start">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-medium text-primary line-clamp-2">{s.factor}</p>
                  <p className="text-xs tabular-nums text-muted-foreground mt-0.5">
                    {formatMonths(s.baseRunway)} → {formatMonths(s.adjustedRunway)} (
                    {s.differenceMonths >= 0 ? "+" : ""}
                    {s.differenceMonths.toFixed(1)} mo)
                  </p>
                  {commentMap.get(s.driverKey) && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {commentMap.get(s.driverKey)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardPanel>
  );
}
