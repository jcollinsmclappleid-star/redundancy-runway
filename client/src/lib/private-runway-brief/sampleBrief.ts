import type { PrivateRunwayBriefNarrative } from "./types";
import { PRIVATE_RUNWAY_BRIEF_DISCLAIMER } from "./types";

/** Static narrative for sample embeds — run `npm run brief:example` to refresh via OpenAI. */
export const SAMPLE_PRIVATE_RUNWAY_NARRATIVE: PrivateRunwayBriefNarrative = {
  generatedAt: "2026-06-25T12:00:00.000Z",
  confidence: "High",
  executiveSummary: {
    headline:
      "Under the sample assumptions, the baseline runway appears manageable, but the stress scenarios show how quickly the picture changes if replacement income is delayed or fixed costs remain high.",
    narrativeSummary:
      "Under the sample assumptions, this model shows a baseline runway supported by an enhanced redundancy package, cash savings and modest gap-period replacement income. Housing costs form a material share of essential expenditure, and the severe-case scenario shortens runway when income is removed from the model. The slow-recovery scenario illustrates what changes if a longer job-gap assumption is applied. This is an illustrative sample only — not a prediction of job outcomes and not advice.",
    qualitativeFindings: [
      {
        themeKey: "starting_capital",
        observation:
          "Under the sample assumptions, starting capital combines the redundancy package with cash savings and liquid investments. The enhanced package figure is used in place of the statutory estimate in the model total, so the runway path reflects the package amount entered in this sample.",
      },
      {
        themeKey: "monthly_pressure",
        observation:
          "Under the sample assumptions, net monthly burn reflects essential and flexible spending minus income included in the model. Replacement income during the job-search period reduces the monthly shortfall compared with the severe scenario, where no income is included.",
      },
      {
        themeKey: "scenario_spread",
        observation:
          "Under the sample assumptions, the scenario range shows how runway length changes when job-gap timing or income inclusion differs from baseline. The slow-recovery scenario applies a longer gap reference — it models a possibility under changed assumptions, not a forecast.",
      },
      {
        themeKey: "housing_pressure",
        observation:
          "Under the sample assumptions, housing is a notable pressure point within essential expenditure. In this model, housing-related assumptions flow through to monthly pressure and to runway length in the sensitivity section.",
      },
      {
        themeKey: "sensitivity",
        observation:
          "Under the sample assumptions, replacement income timing and essential spending levels appear to change the picture most in the sensitivity tests. These are model scenarios, not predictions of what will happen.",
      },
    ],
    methodologyInContext:
      "This sample model calculated starting capital from the entered redundancy package, savings and investments, then projected month-by-month capital depletion using net monthly burn. Scenarios adjust job-gap duration or income inclusion while holding other sample figures constant. All runway months in this example come from that deterministic engine. The commentary reports what the model shows under the sample assumptions — not what to do next.",
  },
  runwayRangeCommentary: {
    summary:
      "Under the sample assumptions, the scenario range shows how runway length changes when income timing, job-gap assumptions or household income structure differ from baseline.",
    scenarioComments: [
      {
        scenarioKey: "baseline",
        interpretation:
          "This scenario uses all sample figures as entered, including replacement income during the job-search period and the stated job-gap duration. It is the primary reference point under the sample assumptions.",
      },
      {
        scenarioKey: "slow_recovery",
        interpretation:
          "This scenario applies a longer job-gap assumption where the labour-market reference exceeds the entered gap. Under the sample assumptions, a longer gap before full income resumes reduces runway compared with baseline.",
      },
      {
        scenarioKey: "severe",
        interpretation:
          "The severe case removes replacement income, benefits and salary for the full projection. Under the sample assumptions, this shows how starting capital would be used if no income were included in the model.",
      },
      {
        scenarioKey: "structural",
        interpretation:
          "This illustrative scenario models a lower-income recovery path with an extended gap. Under the sample assumptions, it shows a more gradual return to prior earnings — not a forecast.",
      },
    ],
  },
  packageCommentary: {
    summary:
      "Under the sample assumptions, the redundancy package combines an enhanced offer with notice and holiday pay. Statutory redundancy remains visible as a reference figure when an enhanced amount replaces it in the model total.",
    componentComments: [
      {
        itemKey: "statutory_redundancy",
        explanation:
          "Under the sample assumptions, the statutory estimate is calculated from age, service and weekly pay. It remains in the model as a reference when an enhanced package is entered.",
      },
      {
        itemKey: "enhanced_redundancy",
        explanation:
          "The enhanced redundancy assumption replaces the statutory element in the package total used for starting capital under the sample assumptions.",
      },
      {
        itemKey: "notice_pay",
        explanation:
          "Notice pay is modelled separately from statutory redundancy and is included in the package total under the sample assumptions.",
      },
      {
        itemKey: "holiday_pay",
        explanation:
          "Accrued holiday pay is included as a separate package line under the sample assumptions entered.",
      },
    ],
  },
  positionEnhancementCommentary: {
    summary:
      "Under the sample assumptions, the enhanced package lifts the model total above the statutory-only baseline, but unpaid wages, bonus and payment timing are not fully confirmed in the figures entered.",
    packageOpportunities: [
      "Unpaid wages are not included — confirming final payroll items could change starting capital.",
      "The employer or manual package figure should be checked against the settlement letter or offer breakdown.",
      "Comparing statutory-only (~4 months on household costs) with the entered package (~10 months) shows how component gaps affect the picture.",
      "Tax treatment is marked unclear — gross figures are used in this model until confirmed.",
    ],
    consultationReadiness:
      "Under the sample assumptions, payment date and tax treatment are worth confirming with HR or payroll before relying on cash timing in this model. This is preparation support only — not legal or employment advice.",
    leverageThemes: [
      "Package components missing — clarifying missing items could improve the package total picture.",
      "Enhanced or manual package — compare breakdown against the statutory estimate.",
      "Payment date — confirm timing so cash availability aligns with household costs.",
      "Payout improvement scenarios — different package totals could change how many months the money may last.",
    ],
  },
  capitalCompositionCommentary: {
    summary:
      "Under the sample assumptions, starting capital combines the redundancy package, cash savings and liquid investments. The enhanced package replaces the statutory estimate in the model total.",
    itemComments: [
      {
        itemKey: "redundancy_package",
        explanation:
          "The enhanced package plus notice and holiday pay form the redundancy component used in starting capital under the sample assumptions.",
      },
      {
        itemKey: "cash_savings",
        explanation:
          "Cash savings provide immediate liquidity during the gap period under the sample assumptions.",
      },
      {
        itemKey: "liquid_investments",
        explanation:
          "Liquid investments are included as accessible capital in the model under the sample assumptions.",
      },
    ],
  },
  pressureMapCommentary: {
    summary:
      "Under the sample assumptions, monthly pressure is driven by essential costs, with housing and debt repayments among the larger items. Net monthly burn reflects the shortfall after income included in the model.",
    pressurePointComments: [
      {
        pointKey: "essential_expenses",
        interpretation:
          "Essential costs form the core monthly outflow under the sample assumptions. Housing and childcare are among the larger components.",
      },
      {
        pointKey: "housing",
        interpretation:
          "Housing represents a significant share of essentials under the sample assumptions — a common pressure point in redundancy runway models.",
      },
      {
        pointKey: "net_burn",
        interpretation:
          "Net monthly burn is the gap between total expenses and income included in the model. Under the sample assumptions, replacement income reduces but does not eliminate this shortfall.",
      },
    ],
  },
  sensitivityCommentary: {
    summary:
      "Under the sample assumptions, runway appears most sensitive to replacement income timing and essential spending levels. These are model stress tests, not predictions.",
    driverComments: [
      {
        driverKey: "job_gap_delay_3",
        explanation:
          "Delaying income resumption would shorten runway under the sample assumptions, as capital is drawn for longer before full income returns.",
      },
      {
        driverKey: "essential_expenses_20",
        explanation:
          "An increase in essential costs would reduce runway under the sample assumptions, reflecting how fixed costs affect the monthly shortfall.",
      },
      {
        driverKey: "housing_cost_increase_2",
        explanation:
          "A small increase in housing cost would affect runway under the sample assumptions, given housing's share of essentials.",
      },
    ],
  },
  assumptionsCommentary: {
    confidenceSummary: "High data completeness. Key sample inputs are populated for this illustrative example.",
    itemsToCheck: [
      {
        inputKey: "redundancy_package",
        whyItMatters:
          "The package figure affects starting capital directly. In a personal report, confirming this against your settlement letter would help verify the model input.",
      },
      {
        inputKey: "replacement_timing",
        whyItMatters:
          "The job-gap duration shapes when full income resumes in the model. This is an assumption, not a forecast.",
      },
      {
        inputKey: "housing",
        whyItMatters:
          "Housing is a material share of essentials in this sample. Verifying the monthly housing figure would help confirm monthly pressure in a personal report.",
      },
    ],
  },
  professionalQuestions: {
    financialAdviser: [
      "What assumptions should I verify before relying on this runway model?",
      "How should I think about the starting capital figure in a regulated advice conversation?",
      "Which documents would help confirm the redundancy package amount entered?",
    ],
    mortgageBroker: [
      "How should I think about my housing cost relative to gap-period income under the figures entered?",
      "Which documents would help confirm my current mortgage payment in this model?",
    ],
    employerOrCareer: [
      "What assumptions in my job-gap timing should I verify with my own research?",
      "Where can I check official guidance on redundancy notice and pay?",
    ],
    benefitsSignposting: [
      "Where can I check official guidance on support during a job-search period?",
      "What assumptions should I verify before including a benefits estimate in this model?",
    ],
  },
  resetCta: {
    title: "Want help turning this into a practical next-step plan?",
    body: "The 7-Day Redundancy Reset is a separate human-written support product that helps you organise the next 7 days. It is practical written support only, not advice.",
  },
  disclaimer: PRIVATE_RUNWAY_BRIEF_DISCLAIMER,
};

SAMPLE_PRIVATE_RUNWAY_NARRATIVE.disclaimer = PRIVATE_RUNWAY_BRIEF_DISCLAIMER;
