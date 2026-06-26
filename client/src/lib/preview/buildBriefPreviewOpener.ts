import type { RunwayInputs } from "@shared/schema";
import { computeRunway, formatGBP, formatMonths } from "@/lib/engine";
import { buildBriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { buildPositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";

export function buildBriefPreviewOpener(inputs: RunwayInputs): {
  lead: string;
  detail: string;
} {
  const baseline = computeRunway(inputs);
  const dashboard = buildBriefDashboardData(inputs);
  const pkg = buildPackageDashboardData(inputs);
  const topNegativeSens = dashboard.sensitivity.find((s) => s.differenceMonths < 0);

  const lead = `Under your assumptions, starting capital of ${formatGBP(baseline.startingCapital)} may support roughly ${formatMonths(baseline.monthsUntilDepletion)} at current net burn. Your estimated package total in this model is ${formatGBP(pkg.packageTotal)}.`;

  const detailParts: string[] = [];
  if (pkg.offerComparison.hasEmployerOffer && pkg.offerComparison.difference > 0) {
    detailParts.push(
      `the employer or manual package entered is ${formatGBP(pkg.offerComparison.difference)} above the statutory estimate under these assumptions`,
    );
  }
  if (topNegativeSens) {
    detailParts.push(
      `${topNegativeSens.factor.replace(/^If /, "").replace(/ than assumed$/, "")} appears to move the runway picture most in stress tests`,
    );
  }
  if (dashboard.baseline.housingPercentOfEssentials >= 35) {
    detailParts.push("housing remains a material share of essential costs in this model");
  }
  const position = buildPositionEnhancementData(inputs);
  if (position.maximiserPreview.opportunityCount > 0 && position.maximiserPreview.topOpportunityLabel) {
    detailParts.push(
      `${position.maximiserPreview.topOpportunityLabel} is among the areas that could change the package picture`,
    );
  }

  const detail =
    detailParts.length > 0
      ? `The full report compares every scenario side by side and explains what may matter most — including that ${detailParts.slice(0, 2).join(" and ")}.`
      : "The full report compares every scenario side by side and explains your figures in plain English, generated from the assumptions entered.";

  return { lead, detail };
}
