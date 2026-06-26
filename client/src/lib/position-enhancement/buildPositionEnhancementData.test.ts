import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { RunwayInputs } from "@shared/schema";
import { buildPositionEnhancementData } from "./buildPositionEnhancementData.ts";
import { getSituationType, getModuleOrder } from "./situationContext.ts";

function baseInputs(overrides: Partial<RunwayInputs> = {}): RunwayInputs {
  return {
    context: {
      employmentStatus: "redundant",
      housingType: "mortgage",
      householdStructure: "single",
      hasDependents: false,
      confidenceLevel: "uncertain",
    },
    redundancyPackage: {
      age: 40,
      yearsOfService: 5,
      weeklyGrossPay: 800,
      noticeWeeks: 0,
      holidayWeeks: 0,
      enhancedPackage: false,
      enhancedAmount: 0,
      useManualOverride: false,
      manualOverrideAmount: 0,
    },
    cashSavings: 10000,
    liquidInvestments: 0,
    otherOneOffIncome: 0,
    unpaidWages: 0,
    voluntaryRedundancyAmount: 0,
    currentMonthlyNetIncome: 0,
    replacementMonthlyIncome: 0,
    monthsUntilNewJob: 6,
    benefitSupportEstimate: 0,
    partnerMonthlyNetIncome: 0,
    includePartnerIncome: false,
    mortgageOrRent: 1200,
    food: 400,
    utilities: 150,
    councilTax: 150,
    transport: 100,
    insurance: 50,
    childcare: 0,
    otherEssentials: 0,
    subscriptions: 50,
    leisure: 100,
    otherNonEssential: 0,
    includeNonEssential: true,
    ...overrides,
  };
}

describe("situationContext", () => {
  it("routes at-risk users to maximiser-first module order", () => {
    const order = getModuleOrder("at_risk");
    assert.equal(order[0], "maximiser");
    assert.equal(getSituationType("at_risk"), "at_risk");
  });

  it("routes post-redundancy users to maximiser-first module order", () => {
    const order = getModuleOrder("redundant");
    assert.equal(order[0], "maximiser");
    assert.equal(getSituationType("redundant"), "post_redundancy");
  });
});

describe("buildPositionEnhancementData", () => {
  it("flags notice and holiday as could-increase when not entered", () => {
    const data = buildPositionEnhancementData(baseInputs());
    const keys = data.maximiser.couldIncreaseTotal.map((i) => i.itemKey);
    assert.ok(keys.includes("notice_pay"));
    assert.ok(keys.includes("holiday_pay"));
    assert.equal(data.briefSummary.scenarioInsight, "notice_and_holiday_not_in_model");
  });

  it("builds payout scenario ladder with increasing totals", () => {
    const data = buildPositionEnhancementData(
      baseInputs({
        redundancyPackage: {
          age: 40,
          yearsOfService: 5,
          weeklyGrossPay: 800,
          noticeWeeks: 4,
          holidayWeeks: 2,
          enhancedPackage: false,
          enhancedAmount: 0,
          useManualOverride: false,
          manualOverrideAmount: 0,
        },
      }),
    );
    assert.ok(data.payoutScenarios.length >= 4);
    const statutory = data.payoutScenarios.find((s) => s.scenarioKey === "statutory_only");
    const full = data.payoutScenarios.find((s) => s.scenarioKey === "statutory_notice_holiday");
    assert.ok(statutory);
    assert.ok(full);
    assert.ok(full!.packageTotal > statutory!.packageTotal);
    assert.ok(full!.baselineRunwayMonths >= statutory!.baselineRunwayMonths);
  });

    it("exposes maximiser preview as opportunity-led, not completeness", () => {
      const data = buildPositionEnhancementData(baseInputs());
      assert.ok(
        data.maximiserPreview.headline.includes("increase") ||
          data.maximiserPreview.headline.includes("breakdown"),
      );
      assert.equal(data.maximiserPreview.blurredTeaser.includes("%"), false);
    });

  it("includes consultation prep gaps for at-risk users", () => {
    const data = buildPositionEnhancementData(
      baseInputs({
        context: {
          employmentStatus: "at_risk",
          housingType: "mortgage",
          householdStructure: "single",
          hasDependents: false,
          confidenceLevel: "under_pressure",
        },
      }),
    );
    assert.equal(data.situationType, "at_risk");
    assert.ok(data.briefSummary.consultationPrepGaps.length > 0);
    assert.ok(data.leverageMap.some((l) => l.category === "options"));
  });
});
