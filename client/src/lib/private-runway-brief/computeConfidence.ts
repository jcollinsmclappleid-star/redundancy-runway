import type { RunwayInputs } from "@shared/schema";
import type { PrivateRunwayBriefPayload } from "./types";

function essentialTotal(inputs: RunwayInputs): number {
  return (
    inputs.mortgageOrRent +
    inputs.utilities +
    inputs.food +
    inputs.councilTax +
    inputs.insurance +
    inputs.transport +
    inputs.debtRepayments +
    inputs.childcare +
    inputs.otherEssential
  );
}

export function hasUserReportedUncertainty(inputs: RunwayInputs): boolean {
  return inputs.context.confidenceLevel === "uncertain";
}

export function computeConfidence(inputs: RunwayInputs): "High" | "Medium" | "Low" {
  const essentials = essentialTotal(inputs);
  const hasSavingsOrPackage =
    inputs.cashSavings > 0 ||
    inputs.liquidInvestments > 0 ||
    inputs.redundancyPackage.weeklyGrossPay > 0 ||
    inputs.redundancyPackage.useManualOverride ||
    inputs.redundancyPackage.enhancedAmount > 0;

  if (essentials <= 0 && !hasSavingsOrPackage) return "Low";
  if (essentials <= 0) return "Low";

  const hasIncomePath =
    inputs.currentMonthlyNetIncome > 0 ||
    inputs.replacementMonthlyIncome > 0 ||
    inputs.benefitSupportEstimate > 0 ||
    (inputs.includePartnerIncome && inputs.partnerMonthlyNetIncome > 0);

  const packageDetailEntered =
    inputs.redundancyPackage.weeklyGrossPay > 0 ||
    inputs.redundancyPackage.useManualOverride ||
    inputs.redundancyPackage.enhancedAmount > 0;

  const essentialsPopulated =
    inputs.mortgageOrRent > 0 &&
    inputs.food > 0 &&
    (inputs.utilities > 0 || inputs.councilTax > 0);

  const jobGapSet = inputs.monthsUntilNewJob > 0;
  const partnerExplicit =
    !inputs.includePartnerIncome ||
    inputs.partnerMonthlyNetIncome > 0;

  if (
    packageDetailEntered &&
    essentialsPopulated &&
    hasIncomePath &&
    jobGapSet &&
    partnerExplicit &&
    inputs.cashSavings + inputs.liquidInvestments > 0
  ) {
    return "High";
  }

  if (!hasSavingsOrPackage && essentials < 500) return "Low";

  return "Medium";
}

export function detectWeakInputs(inputs: RunwayInputs): PrivateRunwayBriefPayload["weakInputs"] {
  const weak: PrivateRunwayBriefPayload["weakInputs"] = [];

  if (inputs.cashSavings === 0 && inputs.liquidInvestments === 0) {
    weak.push({
      input: "Cash savings and liquid investments",
      whyItMatters: "Starting capital may be understated if you hold savings or investments not entered.",
    });
  }

  if (
    !inputs.redundancyPackage.useManualOverride &&
    inputs.redundancyPackage.weeklyGrossPay === 0 &&
    inputs.redundancyPackage.enhancedAmount === 0
  ) {
    weak.push({
      input: "Redundancy package detail",
      whyItMatters: "Package breakdown affects starting capital and tax-free treatment in the model.",
    });
  }

  if (inputs.replacementMonthlyIncome === 0 && inputs.benefitSupportEstimate === 0 && !inputs.includePartnerIncome) {
    weak.push({
      input: "Gap-period income",
      whyItMatters: "No replacement income, benefits estimate or partner income was included for the job-search period.",
    });
  }

  if (inputs.monthsUntilNewJob === 0 && inputs.currentMonthlyNetIncome > 0) {
    weak.push({
      input: "Months until new job",
      whyItMatters: "A job-gap duration helps model when full income resumes under your assumptions.",
    });
  }

  if (inputs.mortgageOrRent === 0 && inputs.context.housingType !== "owned_outright") {
    weak.push({
      input: "Housing cost",
      whyItMatters: "Mortgage or rent is often the largest essential cost and affects runway materially.",
    });
  }

  if (inputs.context.confidenceLevel === "uncertain") {
    weak.push({
      input: "Self-reported confidence",
      whyItMatters: "You indicated some figures may be uncertain — independent verification may help.",
    });
  }

  if (inputs.redundancyPackage.useManualOverride && inputs.redundancyPackage.manualOverrideAmount > 0) {
    weak.push({
      input: "Manual package override",
      whyItMatters: "A manual package total was used instead of the statutory estimate — confirm this matches your actual terms.",
    });
  }

  return weak;
}
