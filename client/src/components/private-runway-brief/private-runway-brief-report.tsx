import type { RunwayInputs } from "@shared/schema";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import type { BriefNarrativeLite } from "@/lib/private-runway-brief/briefDocumentTypes";
import { StructuredBriefReport } from "./StructuredBriefReport";

interface PrivateRunwayBriefReportProps {
  inputs: RunwayInputs;
  narrative?: PrivateRunwayBriefNarrative | null;
  narrativeLite?: BriefNarrativeLite | null;
  reportId?: string;
  demoMode?: boolean;
}

export function PrivateRunwayBriefReport({
  inputs,
  narrative,
  narrativeLite,
  reportId = "private-runway-brief-report",
  demoMode = false,
}: PrivateRunwayBriefReportProps) {
  return (
    <StructuredBriefReport
      inputs={inputs}
      narrative={narrative}
      narrativeLite={narrativeLite}
      reportId={reportId}
      demoMode={demoMode}
    />
  );
}
