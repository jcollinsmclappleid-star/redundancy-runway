import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeRedundancyEstimate, UK_STATUTORY_REDUNDANCY } from "./engine.ts";
import type { RedundancyPackageInputs } from "@shared/schema";

function basePkg(overrides: Partial<RedundancyPackageInputs> = {}): RedundancyPackageInputs {
  return {
    age: 35,
    yearsOfService: 5,
    weeklyGrossPay: 800,
    noticeWeeks: 4,
    holidayWeeks: 2,
    enhancedPackage: false,
    enhancedAmount: 0,
    useManualOverride: false,
    manualOverrideAmount: 0,
    ...overrides,
  };
}

describe("UK_STATUTORY_REDUNDANCY constants", () => {
  it("uses current weekly pay cap of £751", () => {
    assert.equal(UK_STATUTORY_REDUNDANCY.weeklyPayCap, 751);
    assert.equal(UK_STATUTORY_REDUNDANCY.maxServiceYears, 20);
    assert.equal(UK_STATUTORY_REDUNDANCY.minServiceYears, 2);
    assert.equal(UK_STATUTORY_REDUNDANCY.taxFreeThreshold, 30000);
  });
});

describe("computeRedundancyEstimate", () => {
  it("returns £0 statutory when service is under 2 years", () => {
    const est = computeRedundancyEstimate(basePkg({ yearsOfService: 1, weeklyGrossPay: 600 }));
    assert.equal(est.qualifyingServiceMet, false);
    assert.equal(est.statutoryRedundancy, 0);
    assert.equal(est.noticePay, 2400);
    assert.equal(est.holidayPay, 1200);
  });

  it("applies weekly pay cap to statutory calculation", () => {
    const est = computeRedundancyEstimate(basePkg({ weeklyGrossPay: 1000, yearsOfService: 3, age: 30 }));
    // 3 years aged 30-32: 1 week each = 3 weeks × £751 cap
    assert.equal(est.statutoryRedundancy, 751 * 3);
    assert.equal(est.noticePay, 4000);
  });

  it("caps service years at 20 for statutory bands", () => {
    const capped = computeRedundancyEstimate(basePkg({ yearsOfService: 25, age: 50, weeklyGrossPay: 500 }));
    const twenty = computeRedundancyEstimate(basePkg({ yearsOfService: 20, age: 50, weeklyGrossPay: 500 }));
    assert.equal(capped.statutoryRedundancy, twenty.statutoryRedundancy);
  });

  it("replaces statutory with enhanced amount in total", () => {
    const est = computeRedundancyEstimate(
      basePkg({ enhancedPackage: true, enhancedAmount: 15000, noticeWeeks: 4, holidayWeeks: 1 }),
    );
    assert.equal(est.statutoryRedundancy, 751 * 5);
    assert.equal(est.totalEstimated, 15000 + 3200 + 800);
  });

  it("uses age-band multipliers (41+ gets 1.5 weeks per year)", () => {
    const young = computeRedundancyEstimate(basePkg({ age: 25, yearsOfService: 4, weeklyGrossPay: 600 }));
    const older = computeRedundancyEstimate(basePkg({ age: 45, yearsOfService: 4, weeklyGrossPay: 600 }));
    assert.ok(older.statutoryRedundancy > young.statutoryRedundancy);
  });
});
