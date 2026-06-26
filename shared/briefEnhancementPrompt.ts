/**
 * Enhancement prompt for BRIEF_AI_MODE=lite — executive overlay only.
 * Use when iterating on AI output quality. Numbers always come from the engine, not the model.
 */
export const BRIEF_LITE_ENHANCEMENT_GOAL = `Personalise ONLY the executive summary layer: one headline and up to three theme observations that connect the user's situation flags to what the deterministic model shows — without repeating the detailed playbooks already rendered in sections 4 and 7.`;

export const BRIEF_LITE_THEME_GUIDANCE: Record<string, string> = {
  package_clarity:
    "Emphasise verifying package components (notice, holiday, wages, payment timing) before relying on starting capital — no entitlement language.",
  housing_pressure:
    "Emphasise housing as a share of essentials and how that flows through to monthly pressure — no alarmist language.",
  scenario_spread:
    "Emphasise the gap between baseline and stress scenarios as sensitivity to income timing — not a forecast.",
  monthly_pressure:
    "Emphasise net monthly shortfall after income included in the model — planning framing only.",
  sensitivity:
    "Emphasise which model stress tests moved the months-left figure most — not predictions.",
  data_quality:
    "Emphasise verifying partial or uncertain inputs before planning conversations.",
  starting_capital:
    "Emphasise how package and savings combine in the model — verify breakdown against letters.",
  runway_duration:
    "Emphasise baseline months on household costs vs stress cases under changed assumptions.",
  income_assumptions:
    "Emphasise confirming replacement income, benefits or partner income assumptions in the model.",
};

export const BRIEF_LITE_OBSERVATION_EXAMPLES = [
  {
    themeKey: "package_clarity",
    observation:
      "Under the assumptions entered, several package lines are not yet confirmed in the model. Clarifying notice pay, holiday pay and payment timing could change the starting capital figure used in section 3.",
  },
  {
    themeKey: "housing_pressure",
    observation:
      "Under the assumptions entered, housing forms a material share of essential costs. In this model, that flows through to monthly pressure and to the gap between baseline and stress scenarios.",
  },
  {
    themeKey: "scenario_spread",
    observation:
      "Under the assumptions entered, the stress scenario removes income from the model and shortens the months-left picture. This illustrates sensitivity to income timing — not what will happen.",
  },
];

export const BRIEF_LITE_HEADLINE_EXAMPLES = [
  "Under your assumptions, package verification and consultation preparation appear most relevant alongside the months-left picture.",
  "Under your assumptions, the package breakdown and how it translates to household costs are the central themes in this report.",
  "Under your assumptions, housing costs and package clarity both shape the monthly pressure shown in this model.",
];

/** Forbidden patterns — must match validateBriefNarrative.ts */
export const BRIEF_LITE_FORBIDDEN_PHRASES = [
  "you should",
  "we recommend",
  "you must",
  "entitled to",
  "guaranteed",
  "maximise your payout",
  "best option",
  "will get",
  "will receive",
];

export function buildBriefLiteEnhancementInstructions(allowedThemeKeys: string[]): string {
  const themeHints = allowedThemeKeys
    .slice(0, 6)
    .map((k) => `- ${k}: ${BRIEF_LITE_THEME_GUIDANCE[k] ?? "Report what the model shows under assumptions entered."}`)
    .join("\n");

  return `${BRIEF_LITE_ENHANCEMENT_GOAL}

THEME HINTS (pick up to 3 themeKeys from allowedThemeKeys):
${themeHints}

HEADLINE EXAMPLES (adapt to situation, no numbers):
${BRIEF_LITE_HEADLINE_EXAMPLES.map((h) => `- ${h}`).join("\n")}

OBSERVATION EXAMPLES (adapt, no numbers):
${BRIEF_LITE_OBSERVATION_EXAMPLES.map((o) => `- [${o.themeKey}] ${o.observation}`).join("\n")}

Never use: ${BRIEF_LITE_FORBIDDEN_PHRASES.join(", ")}.`;
}
