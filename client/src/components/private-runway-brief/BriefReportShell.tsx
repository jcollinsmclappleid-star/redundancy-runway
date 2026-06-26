import type { ReactNode } from "react";
import type { BriefDocument } from "@/lib/private-runway-brief/briefDocumentTypes";
import { BriefTableOfContents, BriefTableOfContentsMobile } from "./BriefTableOfContents";
import { Badge } from "@/components/ui/badge";

interface BriefReportShellProps {
  document: BriefDocument;
  reportId?: string;
  demoMode?: boolean;
  children: ReactNode;
}

export function BriefReportShell({
  document,
  reportId = "private-runway-brief-report",
  demoMode = false,
  children,
}: BriefReportShellProps) {
  const tocItems = demoMode
    ? [
        ...document.toc.filter((item) => item.id === "executive" || item.id === "package"),
        {
          id: "brief-demo-locked-sections",
          number: "3+",
          title: "Sections 3–7 (full report)",
        },
      ]
    : document.toc;
  return (
    <div className="relative">
      <BriefTableOfContentsMobile items={tocItems} reportRootId={reportId} />

      <div className="flex gap-8 items-start">
        <aside className="hidden lg:block w-56 shrink-0 sticky top-24 print:hidden">
          <div className="rounded-xl border border-gold/20 bg-white p-4 shadow-sm">
            <BriefTableOfContents items={tocItems} reportRootId={reportId} />
            <div className="mt-4 pt-4 border-t border-gold/15 space-y-2">
              <Badge variant="outline" className="text-[10px] w-full justify-center">
                Report v{document.version}
              </Badge>
              {document.aiEnhanced ? (
                <Badge variant="outline" className="text-[10px] w-full justify-center bg-violet-50 text-violet-800 border-violet-200">
                  AI-enhanced summary
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] w-full justify-center bg-teal-50 text-teal-800 border-teal-200">
                  Expert templates + your figures
                </Badge>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-10">{children}</div>
      </div>
    </div>
  );
}
