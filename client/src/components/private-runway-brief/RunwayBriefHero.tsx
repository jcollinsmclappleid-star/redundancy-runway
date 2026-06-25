import { Badge } from "@/components/ui/badge";
import { RunwayReportBrand } from "@/components/RunwayReportBrand";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import type { BriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import { RESET_CTA_DEFAULTS } from "@/lib/private-runway-brief/types";
import { PRODUCT_COPY, RUNWAY_BRIEF_NAME } from "@shared/product";

interface RunwayBriefHeroProps {
  narrative: PrivateRunwayBriefNarrative;
  dashboard: BriefDashboardData;
}

export function RunwayBriefHero({ narrative, dashboard }: RunwayBriefHeroProps) {
  const generatedDate = new Date(narrative.generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const confidenceCls =
    narrative.confidence === "High"
      ? "bg-teal-500/20 text-teal-100 border-teal-400/30"
      : narrative.confidence === "Medium"
        ? "bg-amber-500/20 text-amber-100 border-amber-400/30"
        : "bg-rose-500/20 text-rose-100 border-rose-400/30";

  return (
    <div className="bg-primary px-4 sm:px-8 py-6 print:bg-primary">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <RunwayReportBrand variant="light" context="brief" showUrl />
          <p className="text-[10px] text-white/50 hidden sm:block">Generated {generatedDate}</p>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold/90 font-medium mb-1">{RUNWAY_BRIEF_NAME}</p>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white">{PRODUCT_COPY.briefHeadline}</h1>
            <p className="text-xs text-white/60 mt-1 sm:hidden">Generated {generatedDate}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`${confidenceCls} text-[10px]`}>
              {dashboard.confidenceDisplayLabel}
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white/90 border-white/20 text-[10px]">
              Based on your figures
            </Badge>
            <Badge variant="outline" className="bg-teal-500/20 text-teal-100 border-teal-400/30 text-[10px]">
              {PRODUCT_COPY.notAdvice}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export { RESET_CTA_DEFAULTS };
