import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import type { RunwayInputs } from "@shared/schema";
import { PACKAGE_DISCLAIMER } from "@shared/complianceCopy";

interface PackageCommentaryPanelProps {
  inputs: RunwayInputs;
  narrative: PrivateRunwayBriefNarrative;
}

export function PackageCommentaryPanel({ inputs, narrative }: PackageCommentaryPanelProps) {
  const data = buildPackageDashboardData(inputs);
  const packageCommentary = narrative.packageCommentary ?? {
    summary: narrative.capitalCompositionCommentary.summary,
    componentComments: narrative.capitalCompositionCommentary.itemComments,
  };
  const commentsByKey = new Map(
    packageCommentary.componentComments.map((c) => [c.itemKey, c.explanation]),
  );

  return (
    <DashboardPanel
      title="What could be included"
      subtitle={packageCommentary.summary}
      testId="brief-package-commentary"
      footer={PACKAGE_DISCLAIMER}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.components.map((c) => {
          const commentary = commentsByKey.get(c.itemKey);
          return (
            <div key={c.itemKey} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-primary mb-1">{c.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">{c.explanation}</p>
              {commentary && (
                <p className="text-xs text-foreground/80 leading-relaxed border-t border-slate-100 pt-2">{commentary}</p>
              )}
            </div>
          );
        })}
      </div>
    </DashboardPanel>
  );
}
