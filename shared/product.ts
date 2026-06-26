import { SITE_NAME, SITE_URL } from "./site";

/**
 * Canonical product names — payout-first, intelligence positioning.
 *
 * Paid (£79): Private Redundancy Pay Intelligence Report
 * Dashboard:  Runway Command Centre
 * Narrative:  Redundancy Runway Brief
 */
export const RUNWAY_REPORT_FULL = "Private Redundancy Pay Intelligence Report";
/** Shorter form for titles, meta and tight UI */
export const RUNWAY_REPORT_SEO = "Redundancy Pay Intelligence Report";
export const RUNWAY_BRIEF_NAME = "Redundancy Runway Brief";
export const COMMAND_CENTRE_NAME = "Runway Command Centre";
export const RUNWAY_REPORT_PRICE_GBP = 79;
/** Flagship package tool — customer-facing name */
export const REDUNDANCY_PAY_MAXIMISER_NAME = "Redundancy Pay Maximiser";
export const RESET_PRICE_GBP_DISPLAY = 95;

export const BRIEF_OPENAI_CONSENT_KEY = "rruk_brief_openai_consent_v1";

/** Accurate privacy messaging — core modelling is browser-local; OpenAI detail shown only after unlock */
export const PRIVACY_COPY = {
  modellingLocal:
    "Core calculations run in your browser and are stored locally on your device (localStorage). We do not store your financial figures on our servers.",
  briefOpenAi:
    `If you choose to generate the optional ${RUNWAY_BRIEF_NAME}, de-identified model outputs (amounts, runway months, employment situation label, housing type, scenario labels and package field statuses — not your name, employer, email or free-text notes) are sent from your browser to our server and forwarded to OpenAI to produce plain-English commentary. The brief is returned to your browser and not retained on our servers.`,
  briefOpenAiConsentTitle: "Optional AI brief enhancement",
  heroTrust: "Browser-local modelling",
  faqPrivacy:
    "Core redundancy and runway calculations run in your browser and stay on your device. We store a session token for paid access — not your financial figures. Optional AI brief enhancement (paid report only) is explained before you use it. See our Privacy Policy for details.",
  exportDelivery:
    "Your report is viewed online in the browser. Use Print → Save as PDF for a PDF copy, download a text summary, or copy to clipboard. We do not email your financial figures — return on any device for 6 months via email sign-in.",
} as const;

export const PRODUCT_COPY = {
  briefHeadline: "Your figures, explained in plain English.",
  dualProductLine:
    "Check what could be in your redundancy package, see how many months it may cover, and prepare the questions to ask before you sign. Your Redundancy Runway Brief explains it in plain English.",
  sampleLabel: "Example only — your figures will depend on the assumptions entered.",
  buildCta: "Check my package and runway",
  buildCtaMobile: "Check package & runway",
  seeIncludedCta: "See the full report",
  seeIncludedCtaMobile: "Full report",
  unlockCta: `Unlock ${RUNWAY_REPORT_FULL}`,
  unlockCtaMobile: `Unlock full report — £${RUNWAY_REPORT_PRICE_GBP}`,
  maximiserUnlockCtaMobile: `Unlock maximiser — £${RUNWAY_REPORT_PRICE_GBP}`,
  bottomCtaFree: "Build my private report — Free preview",
  bottomCtaFreeMobile: "Start free preview",
  bottomCtaPaid: `Unlock full report — £${RUNWAY_REPORT_PRICE_GBP}`,
  fullScenarioCta: `See your full scenario range — £${RUNWAY_REPORT_PRICE_GBP}`,
  unlockHeadline: "Unlock the tools to check the package, protect your runway and prepare before you sign.",
  unlockSubcopy:
    "Go beyond the statutory estimate. The full report helps you check notice, holiday, enhanced pay and missing lines, model payout scenarios, prepare consultation questions and understand how each outcome affects your runway.",
  unlockOutcomes: [
    "Identify components that could increase your package total",
    "Model payout scenarios and see the runway impact",
    "Work through protection measures for your situation",
    "Prepare consultation questions and evidence checklists",
    "Use role protection and alternative-role preparation tools",
    "Read your Redundancy Runway Brief with position commentary",
  ] as const,
  unlockSupportingLine: "One-off payment. Modelling and preparation tools. No subscription.",
  unlockModules: [
    "Protection measures playbook",
    REDUNDANCY_PAY_MAXIMISER_NAME,
    "Missing money checklist",
    "Payout improvement scenarios",
    "Consultation Defence Pack",
    "Role Protection Planner",
    "Decision Leverage Map",
    "Runway Command Centre dashboards",
    "Plain-English Redundancy Runway Brief",
  ] as const,
  /** Commercial positioning — safe, non-guarantee wording */
  positioningHeadline: "Maximise your redundancy package. See what you could get — and how long it may last.",
  positioningSupporting: "Check the package. Protect your runway. Prepare before you sign.",
  positioningPaidValue:
    "Your statutory estimate is only the starting point. The full report shows which package lines to check, what could change the total, and how each outcome affects your runway.",
  /** Preview / wizard unlock sell — three core USPs plus supporting angles */
  previewUnlockHeadline: "Check the package. Protect your runway. Prepare before you sign.",
  previewUnlockSub:
    "Your free preview is the statutory starting point. Unlock one private report to check possible package gaps, compare payout scenarios, stress-test your runway and get a plain-English brief from your figures.",
  previewUnlockAngles: [
    {
      id: "package",
      title: "Maximise the package",
      desc: `${REDUNDANCY_PAY_MAXIMISER_NAME}, missing-money checklist & payout scenarios ranked by runway months gained`,
    },
    {
      id: "runway",
      title: "Survive the gap",
      desc: `${COMMAND_CENTRE_NAME} — slow & severe scenarios, mortgage pressure and month-by-month capital path`,
    },
    {
      id: "prepare",
      title: "Prepare for consultation",
      desc: "Consultation Defence Pack, Role Protection Planner & evidence checklists before HR meetings",
    },
    {
      id: "brief",
      title: "Understand it plainly",
      desc: `${RUNWAY_BRIEF_NAME} with package and position commentary from your figures`,
    },
  ] as const,
  trustLine:
    "Statutory · notice · holiday · enhanced · runway scenarios",
  notAdvice: "Model output · not advice",
  heroEyebrow: "REDUNDANCY PAY MAXIMISER · UK RUNWAY CALCULATOR",
  heroH1:
    "Maximise your redundancy package. See what you could get — and how long it may last.",
  heroSub:
    "Start with a UK statutory estimate, then check notice, holiday, enhanced pay and missing lines. Turn the package into runway months against your real household costs, with preparation prompts before you speak to HR or sign.",
  heroSeoTerms: [
    "Statutory redundancy",
    "Notice & holiday",
    "Enhanced redundancy",
    "Runway months",
  ] as const,
  heroOutcomes: [
    "Check whether notice, holiday, enhanced pay or missing lines could change the total",
    "See how many months your package and savings may cover your household costs",
    "Prepare questions and evidence before consultation, negotiation or signing",
  ] as const,
  heroAssurance: [
    { label: `One-off £${RUNWAY_REPORT_PRICE_GBP}`, sub: "6 months access · no subscription" },
    { label: "UK statutory rules", sub: "Current caps and age bands built in" },
    { label: "Browser-local modelling", sub: "Core figures stay on your device" },
    { label: "Preparation, not advice", sub: "Modelling tools — not legal counsel" },
  ] as const,
  heroPillars: [
    { label: "Redundancy pay", desc: "Statutory, notice, holiday & enhanced" },
    { label: "Months left", desc: "Household costs & scenarios" },
    { label: "Your position", desc: "Maximiser, prep & brief" },
  ] as const,
  maximiserLanding: {
    eyebrow: "Flagship feature · full report",
    headline: "Check what could be in your redundancy package before you rely on the number.",
    subheadline:
      "Most people stop at the statutory figure. The Redundancy Pay Maximiser ranks notice pay, holiday, enhancements and gaps to verify — then shows how many extra runway months each line could buy.",
    statutoryOnlyLabel: "Statutory-only in model",
    fullPackageLabel: "Full package in model",
    runwayDeltaLabel: "Runway months gained in sample",
    ladderTitle: "Ranked by runway impact — sample",
    ladderLocked: "Full ranked ladder, payout scenarios & HR prompts unlock with your figures",
    levers: [
      { title: "Notice or PILON", desc: "Often the largest line after statutory — confirm worked, paid in lieu, or on your letter" },
      { title: "Accrued holiday pay", desc: "Untaken holiday weeks are commonly missed in a quick mental total" },
      { title: "Enhanced redundancy", desc: "Employer top-up above statutory — check it replaces or adds to the minimum" },
      { title: "Unpaid wages & extras", desc: "Final pay, bonus or commission lines that never made it into the headline figure" },
    ] as const,
  },
  reportPackage: {
    sectionTitle: "Maximise your redundancy. Protect your runway. Understand it plainly.",
    sectionSubtitle:
      "Start free with statutory pay and baseline runway. Unlock one private report when you are ready — package maximiser, consultation prep, stress scenarios and a plain-English brief from your figures.",
    free: {
      label: "Free preview",
      price: "£0",
      summary: "No payment · no account required",
      items: [
        "UK statutory redundancy estimate",
        "Baseline runway months & starting capital",
        "Stability score and capital at 3 / 6 / 12 months",
        "Package total preview from your assumptions",
      ],
    },
    paid: {
      label: "Full private report",
      price: `£${RUNWAY_REPORT_PRICE_GBP}`,
      summary: "One payment · 6 months access · No subscription",
      pillars: [
        {
          id: "package",
          title: "Maximise your redundancy",
          tagline: "Improve your package position before you sign",
          items: [
            "Protection measures playbook",
            REDUNDANCY_PAY_MAXIMISER_NAME,
            "Missing money checklist",
            "Payout improvement scenarios",
            "Consultation Defence Pack",
            "Role Protection Planner",
            "Package clarification emails",
            "Decision Leverage Map",
          ],
        },
        {
          id: "runway",
          title: "Protect your runway",
          tagline: "See how long the money may last under stress",
          items: [
            "Payout-to-runway bridge",
            "Slow & severe income scenarios",
            "Mortgage / housing pressure test",
            "Month-by-month capital path",
            "Expense sensitivity & stress cases",
            "Voluntary redundancy comparison",
            `${COMMAND_CENTRE_NAME} dashboards`,
          ],
        },
        {
          id: "brief",
          title: "Understand it plainly",
          tagline: "Your figures explained — not generic advice",
          items: [
            `${RUNWAY_BRIEF_NAME}`,
            "Package & position commentary",
            "Scenario explanations in plain English",
            "Questions to take forward",
            "Downloadable & exportable report",
          ],
        },
      ],
    },
  },
  payoutSectionHeading: "Check what you could get. Then see how long it lasts.",
  payoutSectionBody:
    "Most calculators stop at a statutory figure. RedundancyCalculatorUK checks the package lines that change the total, shows how many runway months each outcome buys, and gives you the questions to ask before you rely on the number.",
  positionTools: [
    {
      title: "Protection measures playbook",
      desc: "Eight preparation pillars — role visibility, consultation records, selection evidence, redeployment, AI exposure and runway checks.",
    },
    {
      title: REDUNDANCY_PAY_MAXIMISER_NAME,
      desc: "Maps every component — what's included, what could increase the total, and high-value figures to clarify with HR.",
    },
    {
      title: "Missing money checklist",
      desc: "Common items people forget — notice pay, holiday, bonus, deductions and payment timing.",
    },
    {
      title: "Payout improvement scenarios",
      desc: "Model statutory-only through to employer offers and see the runway impact of each.",
    },
    {
      title: "Consultation Defence Pack",
      desc: "Questions and evidence checklists to strengthen consultation preparation.",
    },
    {
      title: "Role Protection Planner",
      desc: "Practical steps that may strengthen your position before decisions are final.",
    },
    {
      title: "Package clarification email",
      desc: "Copy-ready templates to clarify package breakdown or consultation details with HR.",
    },
  ] as const,
} as const;

export { SITE_NAME, SITE_URL };
