import type { ReactNode } from "react";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { RunwayReportBrand } from "@/components/RunwayReportBrand";
import { RUNWAY_BRIEF_NAME, SITE_URL } from "@shared/product";

interface PrintFriendlyBriefProps {
  narrative: PrivateRunwayBriefNarrative;
  children: ReactNode;
}

export function PrintFriendlyBrief({ narrative, children }: PrintFriendlyBriefProps) {
  const generatedDate = new Date(narrative.generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="print-friendly-brief">
      {children}
      <footer className="hidden print:block mt-8 pt-4 border-t border-slate-300">
        <div className="flex items-center justify-between gap-4 mb-3">
          <RunwayReportBrand variant="dark" context="brief" showUrl />
          <p className="text-[10px] text-slate-500 text-right">
            {RUNWAY_BRIEF_NAME}
            <br />
            Generated {generatedDate}
          </p>
        </div>
        <p className="text-[10px] text-slate-600">{narrative.disclaimer}</p>
        <p className="text-[9px] text-slate-400 mt-2">{SITE_URL}</p>
      </footer>
    </div>
  );
}
