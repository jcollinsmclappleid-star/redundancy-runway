import type { RunwayInputs } from "@shared/schema";
import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { buildPositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { buildBriefPreviewOpener } from "@/lib/preview/buildBriefPreviewOpener";
import { REDUNDANCY_PAY_MAXIMISER_NAME } from "@shared/product";
import { formatGBP } from "@/lib/engine";

interface PreviewInsightCardProps {
  inputs: RunwayInputs;
}

export function PreviewInsightCard({ inputs }: PreviewInsightCardProps) {
  const insight = useMemo(() => {
    const data = buildPackageDashboardData(inputs);
    const position = buildPositionEnhancementData(inputs);
    const { offerComparison, packageTotal, estimate } = data;
    const { maximiserPreview, maximiser } = position;

    if (offerComparison.hasEmployerOffer && offerComparison.difference > 500) {
      return {
        label: "Package uplift in your model",
        body: `Under your assumptions, the employer or manual package is ${formatGBP(offerComparison.difference)} above the statutory estimate of ${formatGBP(offerComparison.statutoryEstimate)}. The ${REDUNDANCY_PAY_MAXIMISER_NAME} breaks down how each component feeds into starting capital and runway.`,
      };
    }

    if (maximiserPreview.opportunityCount > 0 && maximiserPreview.topOpportunityLabel) {
      const others =
        maximiserPreview.opportunityCount > 1
          ? ` — plus ${maximiserPreview.opportunityCount - 1} other area${maximiserPreview.opportunityCount === 2 ? "" : "s"} to review`
          : "";
      return {
        label: `${REDUNDANCY_PAY_MAXIMISER_NAME} insight`,
        body: `The strongest area to clarify in this model is ${maximiserPreview.topOpportunityLabel}${others}. Unlock to see the full breakdown: what's already included, what could increase the total, and what to verify with HR.`,
      };
    }

    if (packageTotal > estimate.statutoryRedundancy * 1.15 && estimate.statutoryRedundancy > 0) {
      return {
        label: "Wider package in your model",
        body: `Your estimated total package of ${formatGBP(packageTotal)} includes more than statutory redundancy alone (${formatGBP(estimate.statutoryRedundancy)}). The Maximiser maps each component and how it connects to your runway.`,
      };
    }

    if (maximiser.alreadyIncluded.length > 0) {
      return {
        label: `${REDUNDANCY_PAY_MAXIMISER_NAME} insight`,
        body: `${maximiser.alreadyIncluded.length} component${maximiser.alreadyIncluded.length === 1 ? "" : "s"} mapped in your model. Unlock to see the full breakdown and payout improvement scenarios under your assumptions.`,
      };
    }

    const opener = buildBriefPreviewOpener(inputs);
    return {
      label: "From your assumptions",
      body: opener.lead,
    };
  }, [inputs]);

  return (
    <div
      className="rounded-xl border border-gold/25 bg-gradient-to-r from-[hsl(40_30%_98%)] to-white px-5 py-4"
      data-testid="card-preview-insight"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-gold shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-1">{insight.label}</p>
          <p className="text-sm text-foreground/85 leading-relaxed">{insight.body}</p>
        </div>
      </div>
    </div>
  );
}
