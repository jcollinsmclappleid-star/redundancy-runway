import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import { NET_MONTHLY_BURN_HELP } from "@/lib/private-runway-brief/buildBriefDashboardData";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { chartTheme } from "@/lib/chart-theme";

function SeverityChip({ severity }: { severity: "low" | "moderate" | "elevated" }) {
  const cls =
    severity === "low"
      ? "bg-teal-50 text-teal-700 border-teal-200"
      : severity === "moderate"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";
  return (
    <Badge variant="outline" className={`${cls} text-[10px] capitalize`}>
      {severity}
    </Badge>
  );
}

interface MonthlyPressureMapProps {
  dashboard: BriefDashboardData;
  narrative: PrivateRunwayBriefNarrative;
}

export function MonthlyPressureMap({ dashboard, narrative }: MonthlyPressureMapProps) {
  const commentMap = new Map(
    narrative.pressureMapCommentary.pressurePointComments.map((c) => [c.pointKey, c.interpretation]),
  );
  const { baseline } = dashboard;
  const total = baseline.essentialExpenses + baseline.nonEssentialExpenses;
  const essentialPct = total > 0 ? (baseline.essentialExpenses / total) * 100 : 50;
  const flexiblePct = 100 - essentialPct;

  return (
    <DashboardPanel
      title="Monthly pressure map"
      subtitle={narrative.pressureMapCommentary.summary}
      testId="brief-pressure-map"
    >
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Expense split</p>
        <div className="h-4 rounded-full overflow-hidden flex">
          <div
            className="h-full"
            style={{ width: `${essentialPct}%`, background: chartTheme.color.s1 }}
            title="Essential"
          />
          <div
            className="h-full"
            style={{ width: `${flexiblePct}%`, background: chartTheme.color.s3 }}
            title="Flexible"
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Essential {essentialPct.toFixed(0)}%</span>
          <span>Flexible {flexiblePct.toFixed(0)}%</span>
        </div>
      </div>
      <div className="space-y-2">
        {dashboard.pressurePoints.map((p) => (
          <Card key={p.pointKey} className="border border-gold/10 bg-white rounded-lg">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-medium">{p.label}</p>
                <SeverityChip severity={p.severity} />
              </div>
              <p className="text-sm font-semibold text-primary tabular-nums">{p.formattedValue}</p>
              {commentMap.get(p.pointKey) && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{commentMap.get(p.pointKey)}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 italic">{NET_MONTHLY_BURN_HELP}</p>
    </DashboardPanel>
  );
}
