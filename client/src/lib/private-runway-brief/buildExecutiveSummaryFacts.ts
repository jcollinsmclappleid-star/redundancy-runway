import type { BriefDashboardData } from "./buildBriefDashboardData";
import { NET_MONTHLY_BURN_HELP } from "./buildBriefDashboardData";
import { formatGBP, formatMonths } from "@/lib/engine";

export interface ExecutiveSummaryFact {
  factKey: string;
  title: string;
  body: string;
}

export interface ExecutiveSummaryFacts {
  modelCalculated: ExecutiveSummaryFact;
  startingCapitalLogic: ExecutiveSummaryFact;
  monthlyPressureLogic: ExecutiveSummaryFact;
  scenarioDefinitions: ExecutiveSummaryFact[];
  methodologyNote: string;
}

export function buildExecutiveSummaryFacts(dashboard: BriefDashboardData): ExecutiveSummaryFacts {
  const { baseline, composition, scenarios } = dashboard;

  const packageNote = composition.reconciles
    ? "The component breakdown reconciles with the starting capital total used in the model."
    : "Some reference items may be shown separately from starting capital when the package treatment differs from a simple sum.";

  const scenarioLines = scenarios.map(
    (s) => `${s.name}: ${formatMonths(s.monthsUntilDepletion)} — ${s.whatChanged}`,
  );

  return {
    modelCalculated: {
      factKey: "model_calculated",
      title: "What the model calculated",
      body: `Under the assumptions entered, the baseline runway is ${formatMonths(baseline.monthsUntilDepletion)} with starting capital of ${formatGBP(baseline.startingCapital)} and net monthly burn of ${formatGBP(baseline.netMonthlyBurn)}. The Runway Resilience Indicator score is ${baseline.stabilityScore}/100 (${baseline.stabilityBand}).`,
    },
    startingCapitalLogic: {
      factKey: "starting_capital_logic",
      title: "How starting capital was built",
      body: `Starting capital used in the model is ${formatGBP(composition.startingCapitalTotal)}. ${packageNote} Enhanced packages replace the statutory estimate in the total when entered — components are not double-counted.`,
    },
    monthlyPressureLogic: {
      factKey: "monthly_pressure_logic",
      title: "How monthly pressure works",
      body: `Monthly essential costs are ${formatGBP(baseline.essentialExpenses)}/mo and flexible costs are ${formatGBP(baseline.nonEssentialExpenses)}/mo. Income included in the model is ${formatGBP(baseline.incomeIncluded)}/mo. ${NET_MONTHLY_BURN_HELP} Under your assumptions, net monthly burn is ${formatGBP(baseline.netMonthlyBurn)}/mo.`,
    },
    scenarioDefinitions: [
      {
        factKey: "scenario_definitions",
        title: "What each scenario changes",
        body: scenarioLines.join(" "),
      },
    ],
    methodologyNote:
      "This is a 60-month deterministic projection based on the figures entered. It applies monthly cash flows from starting capital until capital reaches zero or the projection limit. Scenario ranges use illustrative assumption changes or labour-market reference data — not individual predictions. This is not financial, legal, tax, employment, debt, mortgage, benefits or career advice.",
  };
}
