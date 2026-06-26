import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { POSITION_ENHANCEMENT_DISCLAIMER } from "@shared/complianceCopy";

interface PositionEnhancementCommentaryPanelProps {
  narrative: PrivateRunwayBriefNarrative;
}

export function PositionEnhancementCommentaryPanel({ narrative }: PositionEnhancementCommentaryPanelProps) {
  const commentary = narrative.positionEnhancementCommentary;
  if (!commentary) return null;

  return (
    <DashboardPanel
      title="Position improvement commentary"
      subtitle="Package maximisation opportunities and preparation gaps under your assumptions."
      testId="brief-position-enhancement-commentary"
      footer={POSITION_ENHANCEMENT_DISCLAIMER}
    >
      <p className="text-sm text-foreground leading-relaxed mb-4">{commentary.summary}</p>

      {commentary.packageOpportunities.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-primary mb-2">Package understanding opportunities</p>
          <ul className="space-y-2">
            {commentary.packageOpportunities.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                <span className="text-primary shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {commentary.consultationReadiness && commentary.consultationReadiness.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-primary mb-2">Consultation readiness</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{commentary.consultationReadiness}</p>
        </div>
      )}

      {commentary.leverageThemes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-primary mb-2">Decision leverage themes</p>
          <ul className="space-y-2">
            {commentary.leverageThemes.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                <span className="text-primary shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardPanel>
  );
}
