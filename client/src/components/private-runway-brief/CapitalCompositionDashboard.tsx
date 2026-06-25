import { Card, CardContent } from "@/components/ui/card";
import { formatGBP } from "@/lib/engine";
import type { BriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { CapitalCompositionBar } from "@/components/capital-composition-bar";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";

interface CapitalCompositionDashboardProps {
  dashboard: BriefDashboardData;
  narrative: PrivateRunwayBriefNarrative;
}

export function CapitalCompositionDashboard({ dashboard, narrative }: CapitalCompositionDashboardProps) {
  const commentMap = new Map(
    narrative.capitalCompositionCommentary.itemComments.map((c) => [c.itemKey, c.explanation]),
  );
  const { composition } = dashboard;

  return (
    <DashboardPanel
      title="Capital composition"
      subtitle={narrative.capitalCompositionCommentary.summary}
      testId="brief-capital-composition"
    >
      {dashboard.compositionBar.length > 0 && (
        <div className="mb-5">
          <CapitalCompositionBar
            segments={dashboard.compositionBar.map((s) => ({
              label: s.label,
              value: s.value,
              color: s.color,
            }))}
          />
        </div>
      )}
      <div className="space-y-2 mb-4">
        {composition.includedInStartingCapital.map((item) => (
          <Card key={item.itemKey} className="border border-gold/10 bg-white rounded-lg">
            <CardContent className="py-3 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                {commentMap.get(item.itemKey) && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {commentMap.get(item.itemKey)}
                  </p>
                )}
              </div>
              <p className="text-sm font-bold text-primary tabular-nums shrink-0">{formatGBP(item.amount)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="p-3 rounded-lg border border-primary/15 bg-primary/5">
        <p className="text-sm font-semibold text-primary">
          Starting capital used in model: {formatGBP(composition.startingCapitalTotal)}
        </p>
        {!composition.reconciles && (
          <p className="text-xs text-muted-foreground mt-1">
            Component breakdown may not sum exactly due to rounding or package treatment in the model.
          </p>
        )}
      </div>
      {composition.shownSeparately.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Shown separately from starting capital
          </p>
          {composition.shownSeparately.map((item) => (
            <div key={item.itemKey} className="flex justify-between text-sm text-muted-foreground px-1">
              <span>{item.label}</span>
              <span className="tabular-nums">{formatGBP(item.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </DashboardPanel>
  );
}
