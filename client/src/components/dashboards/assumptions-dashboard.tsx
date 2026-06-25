import { ExternalLink } from "lucide-react";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { formatGBP, UK_STATUTORY_REDUNDANCY } from "@/lib/engine";
import { ukBenchmarks } from "@/lib/ukBenchmarks";
import type { RunwayInputs } from "@shared/schema";

interface AssumptionsDashboardProps {
  inputs: RunwayInputs;
  startingCapital: number;
  savingsLabel: string;
  housingPercent: number;
}

function InputChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2">
      <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-[#1a3357] tabular-nums">{value}</p>
    </div>
  );
}

export function AssumptionsDashboard({ inputs, startingCapital, savingsLabel, housingPercent }: AssumptionsDashboardProps) {
  const statutoryRows = [
    { label: "Weekly pay cap (statutory)", value: `${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)}/week` },
    { label: "Maximum qualifying service", value: `${UK_STATUTORY_REDUNDANCY.maxServiceYears} years` },
    { label: "Minimum qualifying service", value: `${UK_STATUTORY_REDUNDANCY.minServiceYears} years` },
    { label: "Tax-free redundancy threshold", value: formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold) },
    { label: "Age band multipliers", value: "Under 22: ×0.5 · 22–40: ×1 · 41+: ×1.5" },
  ];

  return (
    <div className="space-y-5" data-testid="assumptions-dashboard">
      <DashboardPanel title="Your input snapshot" subtitle="Read-only summary of assumptions driving this report." testId="panel-input-snapshot">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          <InputChip label="Cash savings" value={formatGBP(inputs.cashSavings)} />
          <InputChip label="Liquid investments" value={formatGBP(inputs.liquidInvestments)} />
          <InputChip label="Replacement income" value={formatGBP(inputs.replacementMonthlyIncome) + "/mo"} />
          <InputChip label="Months to new job" value={String(inputs.monthsUntilNewJob)} />
          <InputChip label="Essential costs" value={formatGBP(
            inputs.councilTax + inputs.utilities + inputs.food + inputs.insurance + inputs.transport + inputs.debtRepayments + inputs.childcare + inputs.mortgageOrRent + inputs.otherEssential
          ) + "/mo"} />
          <InputChip label="Non-essential" value={formatGBP(
            inputs.subscriptions + inputs.leisure + inputs.travel + inputs.discretionaryOther + inputs.retrainingMonthlyCost
          ) + "/mo"} />
          <InputChip label="Housing" value={formatGBP(inputs.mortgageOrRent) + "/mo"} />
          <InputChip label="Starting capital (model)" value={formatGBP(startingCapital)} />
        </div>
      </DashboardPanel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardPanel title="Statutory assumptions" subtitle={`UK redundancy rules applied in the model. Last checked ${UK_STATUTORY_REDUNDANCY.lastChecked}.`} testId="panel-statutory">
          <div className="space-y-2">
            {statutoryRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-mono font-medium text-[#1a3357] text-right">{row.value}</span>
              </div>
            ))}
            <a
              href="https://www.gov.uk/calculate-your-redundancy-pay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              GOV.UK statutory calculator <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Data sources" subtitle="Benchmark and context data — does not alter your projection." testId="panel-sources">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-slate-500">UK median household savings</span>
              <span className="font-medium text-[#1a3357]">{formatGBP(ukBenchmarks.savingsBenchmarks.medianHouseholdSavings)}</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-slate-500">Your position</span>
              <span className="font-medium text-[#1a3357]">{savingsLabel}</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-slate-500">Redundancies (latest quarter)</span>
              <span className="font-medium text-[#1a3357]">{ukBenchmarks.redundancyContext.totalRedundanciesLabel}</span>
            </div>
            {inputs.mortgageOrRent > 0 && (
              <div className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="text-slate-500">Your housing share of essentials</span>
                <span className="font-medium text-[#1a3357]">{housingPercent}%</span>
              </div>
            )}
            <p className="text-[10px] text-slate-500 pt-1">
              Sources: ONS Labour Market Statistics, Wealth &amp; Assets Survey. Last updated {ukBenchmarks.meta.lastUpdated}.
            </p>
          </div>
        </DashboardPanel>
      </div>

      <DashboardPanel
        title="Methodology"
        subtitle="60-month deterministic projection · browser-only · illustrative only."
        testId="panel-methodology"
        footer="This tool does not provide financial, employment, debt, tax, or benefits advice."
      >
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            Capital runway is calculated by projecting monthly cash flows from starting capital, applying income and total expenses, until capital reaches zero or the 60-month limit.
          </p>
          <p>
            Projection range uses historical UK reemployment percentiles as reference data — population-level distributions, not individual predictions.
          </p>
          <p>
            Runway Resilience Indicator (RRI) is a model score (0–100) based on runway duration, housing exposure, debt load, gap income coverage, capital cover, and non-essential spending share.
          </p>
        </div>
      </DashboardPanel>
    </div>
  );
}
