import type { RunwayInputs } from "@shared/schema";
import { computeRedundancyEstimate } from "@/lib/engine";
import type { PayloadCompositionItem } from "./types";

export interface CompositionReconciliation {
  includedInStartingCapital: Array<PayloadCompositionItem & { itemKey: string }>;
  shownSeparately: Array<PayloadCompositionItem & { itemKey: string }>;
  startingCapitalTotal: number;
  componentsSum: number;
  reconciles: boolean;
}

export function buildComposition(inputs: RunwayInputs, startingCapitalTotal: number): CompositionReconciliation {
  const redundancyEst = computeRedundancyEstimate(inputs.redundancyPackage);
  const pkg = inputs.redundancyPackage;

  const packageTotal =
    pkg.useManualOverride && pkg.manualOverrideAmount > 0
      ? pkg.manualOverrideAmount
      : redundancyEst.totalEstimated;

  const included: CompositionReconciliation["includedInStartingCapital"] = [];
  const separate: CompositionReconciliation["shownSeparately"] = [];

  if (pkg.useManualOverride && pkg.manualOverrideAmount > 0) {
    included.push({ itemKey: "manual_package", label: "Manual package total", amount: packageTotal });
  } else if (pkg.enhancedPackage && pkg.enhancedAmount > 0) {
    included.push({
      itemKey: "redundancy_package",
      label: "Redundancy package (enhanced)",
      amount: packageTotal,
    });
    if (redundancyEst.statutoryRedundancy > 0) {
      separate.push({
        itemKey: "statutory_reference",
        label: "Statutory redundancy estimate (reference only)",
        amount: redundancyEst.statutoryRedundancy,
      });
    }
  } else if (packageTotal > 0) {
    if (redundancyEst.statutoryRedundancy > 0) {
      included.push({
        itemKey: "statutory_redundancy",
        label: "Statutory redundancy estimate",
        amount: redundancyEst.statutoryRedundancy,
      });
    }
    if (redundancyEst.noticePay > 0) {
      included.push({ itemKey: "notice_pay", label: "Notice pay", amount: redundancyEst.noticePay });
    }
    if (redundancyEst.holidayPay > 0) {
      included.push({ itemKey: "holiday_pay", label: "Holiday pay", amount: redundancyEst.holidayPay });
    }
    if (included.length === 0) {
      included.push({ itemKey: "redundancy_package", label: "Redundancy package (estimated)", amount: packageTotal });
    }
  }

  if (inputs.cashSavings > 0) {
    included.push({ itemKey: "cash_savings", label: "Cash savings", amount: inputs.cashSavings });
  }
  if (inputs.liquidInvestments > 0) {
    included.push({ itemKey: "liquid_investments", label: "Liquid investments", amount: inputs.liquidInvestments });
  }
  if (inputs.otherOneOffIncome > 0) {
    included.push({ itemKey: "other_one_off", label: "Other one-off income", amount: inputs.otherOneOffIncome });
  }
  if ((inputs.unpaidWages ?? 0) > 0) {
    included.push({ itemKey: "unpaid_wages", label: "Unpaid wages", amount: inputs.unpaidWages ?? 0 });
  }

  const componentsSum = included.reduce((sum, c) => sum + c.amount, 0);
  const reconciles = Math.abs(componentsSum - startingCapitalTotal) < 1;

  return {
    includedInStartingCapital: included,
    shownSeparately: separate,
    startingCapitalTotal,
    componentsSum,
    reconciles,
  };
}
