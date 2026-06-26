import type { RunwayInputs } from "@shared/schema";
import { computeRedundancyEstimate } from "@/lib/engine";
import { computeConfidence, detectWeakInputs, hasUserReportedUncertainty } from "./computeConfidence";
import { buildBriefDashboardData } from "./buildBriefDashboardData";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { buildPositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import type { PrivateRunwayBriefPayload } from "./types";

const EMPLOYMENT_LABELS: Record<string, string> = {
  redundant: "Recently made redundant",
  at_risk: "At risk of redundancy",
  restructuring: "Employer restructuring",
  voluntary_redundancy: "Considering voluntary redundancy",
  contract_ending: "Contract ending",
  ai_automation_concern: "Role change / automation concern",
  other_disruption: "Other employment disruption",
};

export function buildPayload(inputs: RunwayInputs): PrivateRunwayBriefPayload {
  const dashboard = buildBriefDashboardData(inputs);
  const packageData = buildPackageDashboardData(inputs);
  const positionData = buildPositionEnhancementData(inputs);
  const redundancyEst = computeRedundancyEstimate(inputs.redundancyPackage);
  const confidence = computeConfidence(inputs);

  const packageTotal =
    inputs.redundancyPackage.useManualOverride && inputs.redundancyPackage.manualOverrideAmount > 0
      ? inputs.redundancyPackage.manualOverrideAmount
      : redundancyEst.totalEstimated;

  return {
    confidence,
    hasUserReportedUncertainty: hasUserReportedUncertainty(inputs),
    confidenceDisplayLabel: dashboard.confidenceDisplayLabel,
    context: {
      employmentStatus: EMPLOYMENT_LABELS[inputs.context.employmentStatus] ?? inputs.context.employmentStatus,
      housingType: inputs.context.housingType,
      householdStructure: inputs.context.householdStructure,
      hasDependents: inputs.context.hasDependents,
      confidenceLevel: inputs.context.confidenceLevel,
    },
    baseline: {
      monthsUntilDepletion: dashboard.baseline.monthsUntilDepletion,
      startingCapital: dashboard.baseline.startingCapital,
      netMonthlyBurn: dashboard.baseline.netMonthlyBurn,
      essentialExpenses: dashboard.baseline.essentialExpenses,
      nonEssentialExpenses: dashboard.baseline.nonEssentialExpenses,
      totalExpenses: dashboard.baseline.totalExpenses,
      incomeIncluded: dashboard.baseline.incomeIncluded,
      stabilityBand: dashboard.baseline.stabilityBand,
      stabilityScore: dashboard.baseline.stabilityScore,
    },
    severeCaseRunway: dashboard.severeCaseRunway,
    redundancyPackage: {
      statutoryRedundancy: redundancyEst.statutoryRedundancy,
      noticePay: redundancyEst.noticePay,
      holidayPay: redundancyEst.holidayPay,
      enhancedAmount: inputs.redundancyPackage.enhancedAmount,
      manualOverrideAmount: inputs.redundancyPackage.manualOverrideAmount,
      useManualOverride: inputs.redundancyPackage.useManualOverride,
      totalPackage: packageTotal,
      qualifyingServiceMet: redundancyEst.qualifyingServiceMet,
    },
    composition: dashboard.composition.includedInStartingCapital.map((c) => ({
      label: c.label,
      amount: c.amount,
      itemKey: c.itemKey,
    })),
    compositionReconciliation: {
      startingCapitalTotal: dashboard.composition.startingCapitalTotal,
      componentsSum: dashboard.composition.componentsSum,
      reconciles: dashboard.composition.reconciles,
      shownSeparately: dashboard.composition.shownSeparately.map((c) => ({
        label: c.label,
        amount: c.amount,
        itemKey: c.itemKey,
      })),
    },
    startingCapitalTotal: dashboard.baseline.startingCapital,
    income: {
      currentMonthlyNetIncome: inputs.currentMonthlyNetIncome,
      replacementMonthlyIncome: inputs.replacementMonthlyIncome,
      monthsUntilNewJob: inputs.monthsUntilNewJob,
      benefitSupportEstimate: inputs.benefitSupportEstimate,
      partnerMonthlyNetIncome: inputs.partnerMonthlyNetIncome,
      includePartnerIncome: inputs.includePartnerIncome,
    },
    pressure: {
      label: "Monthly pressure",
      value: `Essentials £${dashboard.baseline.essentialExpenses.toLocaleString("en-GB")}/mo · Flexible £${dashboard.baseline.nonEssentialExpenses.toLocaleString("en-GB")}/mo · Net burn £${dashboard.baseline.netMonthlyBurn.toLocaleString("en-GB")}/mo`,
      housingPercentOfEssentials: dashboard.baseline.housingPercentOfEssentials,
      housingPercentOfIncome: dashboard.baseline.housingPercentOfIncome,
    },
    pressurePoints: dashboard.pressurePoints.map((p) => ({
      pointKey: p.pointKey,
      label: p.label,
      formattedValue: p.formattedValue,
      severity: p.severity,
    })),
    scenarios: dashboard.scenarios.map((s) => ({
      id: s.scenarioKey,
      name: s.name,
      description: s.description,
      monthsUntilDepletion: s.monthsUntilDepletion,
      whatChanged: s.whatChanged,
      includeInBrief: true,
      jobGapMonths: s.jobGapMonths,
    })),
    sensitivity: dashboard.sensitivity,
    assumptionQuality: dashboard.assumptionQuality,
    weakInputs: detectWeakInputs(inputs),
    stabilityFactors: dashboard.stabilityFactors,
    netMonthlyBurnHelp:
      "Net monthly burn is the monthly shortfall after income included in the model.",
    executiveSummaryThemeKeys: [
      "starting_capital",
      "monthly_pressure",
      "scenario_spread",
      "housing_pressure",
      "data_quality",
    ],
    packageComponents: packageData.components.map((c) => ({
      itemKey: c.itemKey,
      label: c.label,
      status: c.status,
    })),
    positionEnhancement: {
      situationType: positionData.briefSummary.situationType,
      topClarificationAreas: positionData.briefSummary.topClarificationAreas,
      missingMoneyKeys: positionData.briefSummary.missingMoneyKeys,
      scenarioInsight: positionData.briefSummary.scenarioInsight,
      consultationPrepGaps: positionData.briefSummary.consultationPrepGaps,
      highValueLabels: positionData.maximiser.highValueToClarify.map((i) => i.label),
      leverageThemes: positionData.leverageMap.map((l) => l.itemKey),
    },
  };
}
