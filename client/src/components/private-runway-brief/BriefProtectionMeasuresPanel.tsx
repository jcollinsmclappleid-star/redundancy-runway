import type { RunwayInputs } from "@shared/schema";
import type { BriefDocument } from "@/lib/private-runway-brief/briefDocumentTypes";
import { BriefReportLayer } from "./BriefReportLayer";
import {
  PROTECTION_MEASURES_DISCLAIMER,
  PROTECTION_MEASURES_INTRO,
  getProtectionMeasuresForReport,
} from "@shared/protectionMeasuresCopy";
import { Badge } from "@/components/ui/badge";

interface BriefProtectionMeasuresPanelProps {
  inputs: RunwayInputs;
  document: BriefDocument;
}

export function BriefProtectionMeasuresPanel({ inputs, document }: BriefProtectionMeasuresPanelProps) {
  const pillars = getProtectionMeasuresForReport(document.situationType, inputs.context.employmentStatus);
  const aiContext =
    inputs.context.employmentStatus === "ai_automation_concern" ||
    inputs.context.employmentStatus === "restructuring";

  return (
    <BriefReportLayer
      layerId="protection-measures"
      title="Protection measures playbook"
      subtitle="Deep preparation actions for your situation — visibility, evidence, consultation records, redeployment and runway."
      priority="high"
      defaultOpen
      testId="brief-protection-measures"
      badge={`${pillars.length} pillars`}
      footer={PROTECTION_MEASURES_DISCLAIMER}
    >
      <p className="text-sm text-foreground/85 leading-relaxed mb-4">{PROTECTION_MEASURES_INTRO}</p>

      {aiContext && (
        <div className="rounded-lg border border-teal-200/70 bg-teal-50/40 px-4 py-3 mb-5 text-xs text-foreground/85 leading-relaxed">
          <p className="font-semibold text-primary mb-1">AI or automation context</p>
          <p>
            You indicated AI or automation may be affecting your role. The AI and automation pillar below helps you
            document task exposure and prepare questions — it does not predict job loss or assess legal rights.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {pillars.map((pillar) => (
          <div
            key={pillar.pillarKey}
            className="rounded-xl border border-gold/20 bg-white overflow-hidden"
            data-testid={`protection-pillar-${pillar.pillarKey}`}
          >
            <div className="px-4 py-3 border-b border-gold/10 bg-primary/5 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-primary">{pillar.title}</p>
              {pillar.aiRelevant && (
                <Badge variant="outline" className="text-[10px]">
                  AI / automation
                </Badge>
              )}
            </div>
            <div className="px-4 py-4 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{pillar.summary}</p>
              <p className="text-xs text-foreground/80 leading-relaxed border-l-2 border-gold/30 pl-3">
                {pillar.whyItMatters}
              </p>
              <ul className="space-y-3">
                {pillar.measures.map((measure) => (
                  <li key={measure.label} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-3">
                    <p className="text-xs font-semibold text-primary mb-1">{measure.label}</p>
                    <p className="text-xs text-foreground/85 leading-relaxed">{measure.detail}</p>
                    {measure.documents && (
                      <p className="text-[10px] text-muted-foreground mt-1.5">Documents: {measure.documents}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </BriefReportLayer>
  );
}
