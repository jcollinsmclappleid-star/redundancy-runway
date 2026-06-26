import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildBriefDocument } from "./buildBriefDocument.ts";
import { EXAMPLE_RUNWAY_INPUTS } from "./exampleInputs.ts";
import { validateBriefNarrativeLite } from "@shared/validateBriefNarrative";
import { BRIEF_SECTION_IDS } from "./briefDocumentTypes.ts";

describe("buildBriefDocument", () => {
  it("builds a structured v2 report without AI", () => {
    const doc = buildBriefDocument(EXAMPLE_RUNWAY_INPUTS);
    assert.equal(doc.version, "2.2");
    assert.ok(doc.professionalQuestions.hrPackage.length >= 4);
    assert.ok(doc.toc.length >= 7);
    assert.ok(doc.executive.headline.length > 10);
    assert.equal(doc.executive.headlineSource, "template");
    assert.ok(doc.executive.findings.length >= 1);
    assert.ok(doc.package.guides.length >= 1);
    assert.equal(doc.aiEnhanced, false);
    assert.ok(doc.toc.some((t) => t.id === BRIEF_SECTION_IDS.position));
  });

  it("accepts valid lite narrative for executive only", () => {
    const lite = {
      executiveHeadline: "Under the assumptions entered, package clarity appears most relevant in this model.",
      executiveObservations: [
        {
          themeKey: "package_clarity",
          observation:
            "Under the assumptions entered, several package components are not yet confirmed in the figures entered.",
        },
      ],
      aiEnhanced: true,
    };
    const validation = validateBriefNarrativeLite(lite);
    assert.equal(validation.ok, true);
    const doc = buildBriefDocument(EXAMPLE_RUNWAY_INPUTS, { narrativeLite: lite });
    assert.equal(doc.aiEnhanced, true);
    assert.equal(doc.executive.headlineSource, "ai");
  });

  it("rejects unsafe lite narrative", () => {
    const validation = validateBriefNarrativeLite({
      executiveHeadline: "You should maximise your payout immediately.",
      executiveObservations: [],
    });
    assert.equal(validation.ok, false);
  });
});
