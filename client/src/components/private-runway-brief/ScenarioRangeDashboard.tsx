import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMonths } from "@/lib/engine";
import type { BriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { chartTheme } from "@/lib/chart-theme";

interface ScenarioRangeDashboardProps {
  dashboard: BriefDashboardData;
  narrative: PrivateRunwayBriefNarrative;
}

export function ScenarioRangeDashboard({ dashboard, narrative }: ScenarioRangeDashboardProps) {
  const maxMonths = Math.max(...dashboard.scenarios.map((s) => s.monthsUntilDepletion), 1);
  const commentMap = new Map(
    narrative.runwayRangeCommentary.scenarioComments.map((c) => [c.scenarioKey, c.interpretation]),
  );

  return (
    <DashboardPanel title="Scenario range" subtitle={narrative.runwayRangeCommentary.summary} testId="brief-scenario-range">
      <div className="space-y-3">
        {dashboard.scenarios.map((s) => {
          const barPct = Math.min(100, (s.monthsUntilDepletion / maxMonths) * 100);
          const interpretation = commentMap.get(s.scenarioKey);
          return (
            <Card key={s.scenarioKey} className="border border-gold/15 bg-white shadow-sm rounded-xl">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-semibold text-primary">{s.name}</h4>
                  <Badge className="bg-primary/10 text-primary border-0 shrink-0 tabular-nums">
                    {formatMonths(s.monthsUntilDepletion)}
                  </Badge>
                </div>
                <div className="h-2 rounded-full bg-slate-100 mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${barPct}%`, background: chartTheme.color.s1 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground italic mb-2">{s.whatChanged}</p>
                {interpretation && (
                  <p className="text-sm text-foreground/80 leading-relaxed">{interpretation}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardPanel>
  );
}
