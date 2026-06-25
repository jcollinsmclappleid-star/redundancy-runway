/**
 * Generates an example Private Runway Brief via OpenAI from realistic sample inputs.
 * Run: npm run brief:example
 */
import { writeFileSync } from "fs";
import { resolve } from "path";
import OpenAI from "openai";
import { buildPayload } from "@/lib/private-runway-brief/buildPayload";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { PRIVATE_RUNWAY_BRIEF_DISCLAIMER } from "@/lib/private-runway-brief/types";
import { formatBriefPlainText } from "@/lib/private-runway-brief/formatBriefPlainText";
import { EXAMPLE_RUNWAY_INPUTS } from "@/lib/private-runway-brief/exampleInputs";
import { PRIVATE_RUNWAY_BRIEF_SYSTEM_PROMPT } from "../server/private-runway-brief/prompt";
import { buildPrivateRunwayBriefUserPrompt } from "../server/private-runway-brief/buildUserPrompt";
import { privateRunwayBriefNarrativeSchema } from "../server/private-runway-brief/schema";

export { EXAMPLE_RUNWAY_INPUTS };

async function main() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.error("OPENAI_API_KEY missing in .env");
    process.exit(1);
  }

  const payload = buildPayload(EXAMPLE_RUNWAY_INPUTS);
  console.log("Sample model figures:");
  console.log(`  Baseline runway: ${payload.baseline.monthsUntilDepletion} months`);
  console.log(`  Starting capital: £${payload.startingCapitalTotal.toLocaleString("en-GB")}`);
  console.log(`  Net monthly burn: £${payload.baseline.netMonthlyBurn.toLocaleString("en-GB")}/mo`);
  console.log(`  Composition reconciles: ${payload.compositionReconciliation.reconciles}`);
  console.log(`  Confidence: ${payload.confidenceDisplayLabel}`);
  console.log("\nCalling OpenAI...\n");

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: PRIVATE_RUNWAY_BRIEF_SYSTEM_PROMPT },
      { role: "user", content: buildPrivateRunwayBriefUserPrompt(payload) },
    ],
    temperature: 0.4,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    console.error("Empty response from OpenAI");
    process.exit(1);
  }

  const narrativeData = JSON.parse(raw) as unknown;
  const parsed = privateRunwayBriefNarrativeSchema.safeParse(narrativeData);
  if (!parsed.success) {
    console.error("Incomplete narrative:", parsed.error.flatten());
    process.exit(1);
  }

  const narrative: PrivateRunwayBriefNarrative = {
    ...parsed.data,
    confidence: payload.confidence,
    generatedAt: new Date().toISOString(),
    disclaimer: PRIVATE_RUNWAY_BRIEF_DISCLAIMER,
  };

  const root = process.cwd();
  const jsonPath = resolve(root, "public/example-private-runway-brief.json");
  const txtPath = resolve(root, "public/example-private-runway-brief.txt");
  const tsPath = resolve(root, "client/src/lib/private-runway-brief/sampleBrief.ts");

  writeFileSync(jsonPath, JSON.stringify(narrative, null, 2));
  writeFileSync(txtPath, formatBriefPlainText(EXAMPLE_RUNWAY_INPUTS, narrative));

  const tsContent = `import type { PrivateRunwayBriefNarrative } from "./types";
import { PRIVATE_RUNWAY_BRIEF_DISCLAIMER } from "./types";

/** AI-generated example from EXAMPLE_RUNWAY_INPUTS — run \`npm run brief:example\` to refresh. */
export const SAMPLE_PRIVATE_RUNWAY_NARRATIVE: PrivateRunwayBriefNarrative = ${JSON.stringify(narrative, null, 2)} as PrivateRunwayBriefNarrative;

SAMPLE_PRIVATE_RUNWAY_NARRATIVE.disclaimer = PRIVATE_RUNWAY_BRIEF_DISCLAIMER;
`;

  writeFileSync(tsPath, tsContent);

  console.log("Example Private Runway Brief generated:");
  console.log(`  JSON: ${jsonPath}`);
  console.log(`  Text: ${txtPath}`);
  console.log(`  UI sample: client/src/lib/private-runway-brief/sampleBrief.ts`);
  console.log(`\nView in browser: http://localhost:5000/brief-example`);
  console.log(`\nHeadline: ${narrative.executiveSummary.headline}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
