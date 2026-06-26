import type { BriefDocument } from "@/lib/private-runway-brief/briefDocumentTypes";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";

interface BriefPackageGuidesPanelProps {
  document: BriefDocument;
}

export function BriefPackageGuidesPanel({ document }: BriefPackageGuidesPanelProps) {
  if (document.package.guides.length === 0) return null;

  return (
    <DashboardPanel
      title="Package component guide"
      subtitle="Standard UK guidance — filtered to components relevant to your model."
      testId="brief-package-guides"
    >
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{document.package.intro}</p>
      <div className="space-y-3">
        {document.package.guides.map((guide) => (
          <div key={guide.itemKey} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-sm font-semibold text-primary mb-1">{guide.title}</p>
            <p className="text-xs text-foreground/85 leading-relaxed mb-2">{guide.body}</p>
            <p className="text-[10px] text-muted-foreground">When relevant: {guide.whenRelevant}</p>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
