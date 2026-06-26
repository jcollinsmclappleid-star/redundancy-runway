import type { RunwayInputs } from "@shared/schema";
import { computeRedundancyEstimate, computeRunway } from "@/lib/engine";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { buildSevereCaseInputs } from "@/lib/runwayAssumptions";
import {
  CONSULTATION_SECTIONS,
  EVIDENCE_PACK_ITEMS,
  ROLE_PROTECTION_SECTIONS,
  SELECTION_CRITERIA,
  ALTERNATIVE_ROLE_QUESTIONS,
  ALTERNATIVE_ROLE_CHECKLIST,
} from "@shared/positionEnhancementCopy";
import {
  getSituationType,
  getModuleOrder,
  getRecommendedModuleIds,
  type PositionModuleId,
  type SituationType,
} from "./situationContext";

export type MaximiserBucket =
  | "alreadyIncluded"
  | "notYetIncluded"
  | "couldIncreaseTotal"
  | "needsChecking"
  | "highValueToClarify";

export interface MaximiserItem {
  itemKey: string;
  label: string;
  message: string;
  wizardStep: number;
  amount: number | null;
}

export type MissingMoneyStatus = "included" | "missing" | "unclear" | "not_applicable";

export interface MissingMoneyItem {
  itemKey: string;
  label: string;
  status: MissingMoneyStatus;
  whyItMatters: string;
  whereToCheck: string;
  wizardStep: number;
  amount: number | null;
}

export interface PayoutScenarioRow {
  scenarioKey: string;
  label: string;
  packageTotal: number;
  startingCapital: number;
  baselineRunwayMonths: number;
  severeRunwayMonths: number;
  deltaVsStatutory: number;
  deltaVsCurrent: number;
}

export type LeverageCategory = "money" | "time" | "options" | "evidence";

export interface LeverageMapItem {
  itemKey: string;
  category: LeverageCategory;
  label: string;
  currentStatus: string;
  improvementOpportunity: string;
  actionTarget: PositionModuleId | "tab-bridge" | "tab-offer" | "tab-brief";
}

export interface PositionEnhancementBriefSummary {
  situationType: SituationType;
  topClarificationAreas: Array<{ itemKey: string; label: string; bucket: MaximiserBucket }>;
  missingMoneyKeys: string[];
  scenarioInsight: string;
  consultationPrepGaps: string[];
}

export interface MaximiserPreviewSummary {
  /** Short line for paywall / insight cards — opportunity-led, not completeness */
  headline: string;
  topOpportunityLabel: string | null;
  includedCount: number;
  opportunityCount: number;
  /** Personalised blurred value on locked preview cards */
  blurredTeaser: string;
}

export interface PositionEnhancementData {
  situationType: SituationType;
  moduleOrder: PositionModuleId[];
  recommendedModuleIds: PositionModuleId[];
  maximiser: Record<MaximiserBucket, MaximiserItem[]>;
  missingMoney: MissingMoneyItem[];
  payoutScenarios: PayoutScenarioRow[];
  currentPackageTotal: number;
  statutoryOnlyTotal: number;
  leverageMap: LeverageMapItem[];
  briefSummary: PositionEnhancementBriefSummary;
  consultationSections: typeof CONSULTATION_SECTIONS;
  evidencePackItems: typeof EVIDENCE_PACK_ITEMS;
  roleProtectionSections: typeof ROLE_PROTECTION_SECTIONS;
  selectionCriteria: typeof SELECTION_CRITERIA;
  alternativeRoleQuestions: typeof ALTERNATIVE_ROLE_QUESTIONS;
  alternativeRoleChecklist: typeof ALTERNATIVE_ROLE_CHECKLIST;
  maximiserPreview: MaximiserPreviewSummary;
}

function runwayWithPackageTotal(
  inputs: RunwayInputs,
  packageTotal: number,
): { startingCapital: number; baselineRunwayMonths: number; severeRunwayMonths: number } {
  const scenarioInputs: RunwayInputs = {
    ...inputs,
    redundancyPackage: {
      ...inputs.redundancyPackage,
      useManualOverride: true,
      manualOverrideAmount: packageTotal,
    },
  };
  const baseline = computeRunway(scenarioInputs);
  const severe = computeRunway(buildSevereCaseInputs(scenarioInputs).inputs);
  return {
    startingCapital: baseline.startingCapital,
    baselineRunwayMonths: baseline.monthsUntilDepletion,
    severeRunwayMonths: severe.monthsUntilDepletion,
  };
}

function mapChecklistStatus(
  status: "entered" | "not_entered" | "not_applicable" | "verify",
): MissingMoneyStatus {
  if (status === "entered") return "included";
  if (status === "not_applicable") return "not_applicable";
  if (status === "verify") return "unclear";
  return "missing";
}

function buildMaximiser(inputs: RunwayInputs, pkgData: ReturnType<typeof buildPackageDashboardData>) {
  const buckets: Record<MaximiserBucket, MaximiserItem[]> = {
    alreadyIncluded: [],
    notYetIncluded: [],
    couldIncreaseTotal: [],
    needsChecking: [],
    highValueToClarify: [],
  };

  const highValueKeys = new Set(["notice_pay", "holiday_pay", "enhanced_redundancy", "manual_package", "unpaid_wages"]);

  for (const c of pkgData.components) {
    const item: MaximiserItem = {
      itemKey: c.itemKey,
      label: c.label,
      message:
        c.status === "entered" || c.status === "manual_estimate"
          ? `${c.label} is included in the model under the assumptions entered.`
          : c.status === "not_applicable"
            ? `${c.label} is marked not applicable in your inputs.`
            : `${c.label} has not been added. If relevant, this could materially change the package total and runway model.`,
      wizardStep: 0,
      amount: c.amount,
    };

    if (c.status === "entered" || c.status === "manual_estimate") {
      buckets.alreadyIncluded.push(item);
    } else if (c.status === "not_applicable") {
      buckets.notYetIncluded.push(item);
    } else if (highValueKeys.has(c.itemKey)) {
      buckets.couldIncreaseTotal.push(item);
      buckets.highValueToClarify.push(item);
    } else {
      buckets.notYetIncluded.push(item);
    }
  }

  for (const check of pkgData.checklist) {
    if (check.status === "verify") {
      buckets.needsChecking.push({
        itemKey: check.itemKey,
        label: check.label,
        message: `${check.label} may need verification before relying on the package total.`,
        wizardStep: 0,
        amount: null,
      });
    }
  }

  if ((inputs.otherOneOffIncome ?? 0) <= 0) {
    buckets.couldIncreaseTotal.push({
      itemKey: "bonus_commission",
      label: "Bonus or commission",
      message:
        "Bonus or commission has not been added. If relevant, this could materially change the package total and runway model.",
      wizardStep: 0,
      amount: null,
    });
  }

  if (pkgData.offerComparison.hasEmployerOffer && pkgData.offerComparison.difference > 0) {
    buckets.highValueToClarify.push({
      itemKey: "employer_offer",
      label: "Employer or manual package",
      message: "An employer or manual package figure differs from the statutory-only estimate — worth clarifying the breakdown.",
      wizardStep: 0,
      amount: pkgData.offerComparison.employerOffer,
    });
  }

  return buckets;
}

function buildMissingMoney(
  inputs: RunwayInputs,
  pkgData: ReturnType<typeof buildPackageDashboardData>,
): MissingMoneyItem[] {
  const est = pkgData.estimate;
  const amounts: Record<string, number | null> = {
    statutory: est.statutoryRedundancy > 0 ? est.statutoryRedundancy : null,
    enhanced:
      inputs.redundancyPackage.enhancedPackage && inputs.redundancyPackage.enhancedAmount > 0
        ? inputs.redundancyPackage.enhancedAmount
        : null,
    notice: est.noticePay > 0 ? est.noticePay : null,
    holiday: est.holidayPay > 0 ? est.holidayPay : null,
    wages: (inputs.unpaidWages ?? 0) > 0 ? inputs.unpaidWages ?? 0 : null,
    bonus: inputs.otherOneOffIncome > 0 ? inputs.otherOneOffIncome : null,
  };

  return pkgData.checklist.map((item) => ({
    itemKey: item.itemKey,
    label: item.label,
    status: mapChecklistStatus(item.status),
    whyItMatters: item.whyItMatters,
    whereToCheck: item.whereToCheck,
    wizardStep: 0,
    amount: amounts[item.itemKey] ?? null,
  }));
}

function buildPayoutScenarios(
  inputs: RunwayInputs,
  pkgData: ReturnType<typeof buildPackageDashboardData>,
): PayoutScenarioRow[] {
  const est = pkgData.estimate;
  const pkg = inputs.redundancyPackage;

  const statutoryOnly = est.statutoryRedundancy;
  const statutoryNotice = statutoryOnly + est.noticePay;
  const statutoryNoticeHoliday = statutoryOnly + est.noticePay + est.holidayPay;
  const enhancedOffer =
    pkg.enhancedPackage && pkg.enhancedAmount > 0
      ? pkg.enhancedAmount + est.noticePay + est.holidayPay
      : 0;
  const employerOffer = pkgData.offerComparison.hasEmployerOffer ? pkgData.offerComparison.employerOffer : 0;
  const voluntary = (inputs.voluntaryRedundancyAmount ?? 0) > 0 ? inputs.voluntaryRedundancyAmount ?? 0 : 0;
  const current = pkgData.packageTotal;

  const ladder: Array<{ scenarioKey: string; label: string; packageTotal: number }> = [
    { scenarioKey: "statutory_only", label: "Statutory redundancy only", packageTotal: statutoryOnly },
    { scenarioKey: "statutory_notice", label: "Statutory + notice pay", packageTotal: statutoryNotice },
    {
      scenarioKey: "statutory_notice_holiday",
      label: "Statutory + notice + holiday",
      packageTotal: statutoryNoticeHoliday,
    },
  ];

  if (employerOffer > 0) {
    ladder.push({ scenarioKey: "employer_offer", label: "Employer or manual offer", packageTotal: employerOffer });
  }
  if (enhancedOffer > 0 && enhancedOffer !== employerOffer) {
    ladder.push({ scenarioKey: "enhanced_offer", label: "Enhanced redundancy offer", packageTotal: enhancedOffer });
  }
  if (voluntary > 0) {
    ladder.push({
      scenarioKey: "voluntary_offer",
      label: "Voluntary redundancy offer",
      packageTotal: voluntary,
    });
  }
  ladder.push({ scenarioKey: "current_entered", label: "Current entered package", packageTotal: current });

  return ladder.map((row) => {
    const runway = runwayWithPackageTotal(inputs, row.packageTotal);
    return {
      ...row,
      startingCapital: runway.startingCapital,
      baselineRunwayMonths: runway.baselineRunwayMonths,
      severeRunwayMonths: runway.severeRunwayMonths,
      deltaVsStatutory: runway.baselineRunwayMonths - runwayWithPackageTotal(inputs, statutoryOnly).baselineRunwayMonths,
      deltaVsCurrent: runway.baselineRunwayMonths - runwayWithPackageTotal(inputs, current).baselineRunwayMonths,
    };
  });
}

function buildLeverageMap(
  inputs: RunwayInputs,
  pkgData: ReturnType<typeof buildPackageDashboardData>,
  maximiser: PositionEnhancementData["maximiser"],
  situationType: SituationType,
): LeverageMapItem[] {
  const items: LeverageMapItem[] = [];
  const missingCount = maximiser.couldIncreaseTotal.length + maximiser.notYetIncluded.length;

  items.push({
    itemKey: "package_components",
    category: "money",
    label: "Package components missing",
    currentStatus: missingCount > 0 ? `${missingCount} areas not fully modelled` : "Core components entered",
    improvementOpportunity:
      missingCount > 0
        ? "Clarifying missing components could improve the package total picture"
        : "Review high-value items for verification",
    actionTarget: "maximiser",
  });

  if (pkgData.offerComparison.hasEmployerOffer) {
    items.push({
      itemKey: "enhanced_manual",
      category: "money",
      label: "Enhanced or manual package",
      currentStatus: "Employer or manual figure entered",
      improvementOpportunity: "Compare breakdown against statutory estimate",
      actionTarget: "tab-offer",
    });
  }

  if (pkgData.estimate.noticePay <= 0 || inputs.redundancyPackage.noticeWeeks <= 0) {
    items.push({
      itemKey: "notice_pilon",
      category: "money",
      label: "Notice pay / PILON",
      currentStatus: "Not entered in model",
      improvementOpportunity: "If relevant, notice or PILON could change the total materially",
      actionTarget: "missing-money",
    });
  }

  items.push({
    itemKey: "payment_timing",
    category: "time",
    label: "Payment date & runway timing",
    currentStatus: `${pkgData.bridge.baselineRunwayMonths.toFixed(1)} months baseline runway modelled`,
    improvementOpportunity: "Confirm payment timing to align cash availability with expenses",
    actionTarget: "tab-bridge",
  });

  if (situationType === "at_risk") {
    items.push({
      itemKey: "alternative_roles",
      category: "options",
      label: "Alternative roles",
      currentStatus: "Redeployment options not yet mapped",
      improvementOpportunity: "Prepare questions and internal search before consultation",
      actionTarget: "alternative-roles",
    });
    items.push({
      itemKey: "selection_evidence",
      category: "evidence",
      label: "Selection criteria evidence",
      currentStatus: "Evidence pack not yet organised",
      improvementOpportunity: "Gather performance and role-value evidence for discussion",
      actionTarget: "selection-criteria",
    });
  } else {
    items.push({
      itemKey: "payout_scenarios",
      category: "options",
      label: "Payout improvement scenarios",
      currentStatus: "Multiple package outcomes modelled",
      improvementOpportunity: "See how different totals could affect runway",
      actionTarget: "payout-scenarios",
    });
    items.push({
      itemKey: "package_email",
      category: "evidence",
      label: "Package clarification",
      currentStatus: "HR breakdown not yet requested",
      improvementOpportunity: "Use a prepared email to clarify package components",
      actionTarget: "clarification-email",
    });
  }

  return items;
}

function buildScenarioInsight(pkgData: ReturnType<typeof buildPackageDashboardData>): string {
  const gaps: string[] = [];
  if (pkgData.estimate.noticePay <= 0) gaps.push("notice");
  if (pkgData.estimate.holidayPay <= 0) gaps.push("holiday");
  if (pkgData.offerComparison.hasEmployerOffer) gaps.push("employer_offer_delta");
  if (gaps.length === 0) return "core_package_components_entered";
  if (gaps.includes("notice") && gaps.includes("holiday")) return "notice_and_holiday_not_in_model";
  if (gaps.includes("notice")) return "notice_not_in_model";
  if (gaps.includes("holiday")) return "holiday_not_in_model";
  return "package_gaps_present";
}

function buildConsultationPrepGaps(situationType: SituationType): string[] {
  if (situationType !== "at_risk") return [];
  return [
    "selection_criteria_questions",
    "alternative_role_preparation",
    "package_calculation_questions",
  ];
}

function buildMaximiserPreview(
  maximiser: Record<MaximiserBucket, MaximiserItem[]>,
  pkgData: ReturnType<typeof buildPackageDashboardData>,
): MaximiserPreviewSummary {
  const opportunityItems = [
    ...maximiser.couldIncreaseTotal,
    ...maximiser.highValueToClarify.filter(
      (item) => !maximiser.couldIncreaseTotal.some((c) => c.itemKey === item.itemKey),
    ),
  ];
  const uniqueOpportunityKeys = new Set(opportunityItems.map((i) => i.itemKey));
  const opportunityCount = uniqueOpportunityKeys.size;
  const includedCount = maximiser.alreadyIncluded.length;
  const topOpportunityLabel = opportunityItems[0]?.label ?? null;

  let headline: string;
  if (opportunityCount > 0) {
    headline = `${opportunityCount} area${opportunityCount === 1 ? "" : "s"} that could increase the package picture`;
  } else if (pkgData.offerComparison.hasEmployerOffer && pkgData.offerComparison.difference > 0) {
    headline = "Employer package breakdown vs statutory estimate";
  } else {
    headline = "Full component breakdown across your package model";
  }

  const blurredTeaser =
    topOpportunityLabel ??
    (opportunityCount > 0 ? `${opportunityCount} high-value areas` : `${includedCount} components mapped`);

  return {
    headline,
    topOpportunityLabel,
    includedCount,
    opportunityCount,
    blurredTeaser,
  };
}

export function buildPositionEnhancementData(inputs: RunwayInputs): PositionEnhancementData {
  const pkgData = buildPackageDashboardData(inputs);
  const situationType = getSituationType(inputs.context.employmentStatus);
  const maximiser = buildMaximiser(inputs, pkgData);
  const missingMoney = buildMissingMoney(inputs, pkgData);
  const payoutScenarios = buildPayoutScenarios(inputs, pkgData);
  const leverageMap = buildLeverageMap(inputs, pkgData, maximiser, situationType);

  const briefSummary: PositionEnhancementBriefSummary = {
    situationType,
    topClarificationAreas: maximiser.highValueToClarify.slice(0, 3).map((i) => ({
      itemKey: i.itemKey,
      label: i.label,
      bucket: "highValueToClarify" as const,
    })),
    missingMoneyKeys: missingMoney.filter((m) => m.status === "missing").map((m) => m.itemKey),
    scenarioInsight: buildScenarioInsight(pkgData),
    consultationPrepGaps: buildConsultationPrepGaps(situationType),
  };

  return {
    situationType,
    moduleOrder: getModuleOrder(inputs.context.employmentStatus),
    recommendedModuleIds: getRecommendedModuleIds(inputs.context.employmentStatus),
    maximiser,
    missingMoney,
    payoutScenarios,
    currentPackageTotal: pkgData.packageTotal,
    statutoryOnlyTotal: pkgData.statutoryOnlyTotal,
    leverageMap,
    briefSummary,
    consultationSections: CONSULTATION_SECTIONS,
    evidencePackItems: EVIDENCE_PACK_ITEMS,
    roleProtectionSections: ROLE_PROTECTION_SECTIONS,
    selectionCriteria: SELECTION_CRITERIA,
    alternativeRoleQuestions: ALTERNATIVE_ROLE_QUESTIONS,
    alternativeRoleChecklist: ALTERNATIVE_ROLE_CHECKLIST,
    maximiserPreview: buildMaximiserPreview(maximiser, pkgData),
  };
}

/** Exported for payout scenario custom delta calculations in UI */
export function computeCustomPayoutScenario(
  inputs: RunwayInputs,
  packageTotal: number,
  currentTotal: number,
  statutoryOnly: number,
): PayoutScenarioRow {
  const runway = runwayWithPackageTotal(inputs, packageTotal);
  return {
    scenarioKey: "custom",
    label: "Custom package scenario",
    packageTotal,
    startingCapital: runway.startingCapital,
    baselineRunwayMonths: runway.baselineRunwayMonths,
    severeRunwayMonths: runway.severeRunwayMonths,
    deltaVsStatutory: runway.baselineRunwayMonths - runwayWithPackageTotal(inputs, statutoryOnly).baselineRunwayMonths,
    deltaVsCurrent: runway.baselineRunwayMonths - runwayWithPackageTotal(inputs, currentTotal).baselineRunwayMonths,
  };
}

export { computeRedundancyEstimate };
