import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, PoundSterling, AlertTriangle, CheckCircle, Briefcase, Wallet, Receipt, TrendingUp, Heart, Layers, Pencil } from "lucide-react";
import { FieldHelp } from "@/components/ui/field-help";
import { useWizardStore } from "@/lib/wizardStore";
import { getAllSectors, getSectorData } from "@/lib/sectorData";
import { formatGBP, computeRedundancyEstimate } from "@/lib/engine";
import { RedundancyPackageCalculator } from "@/components/redundancy-package-calculator";
import { PackageTotalHero } from "@/components/preview/PackageTotalHero";
import { ukBenchmarks, getAgeBandData, formatWeeksAndMonths, weeksToMonths } from "@/lib/ukBenchmarks";
import type { RunwayInputs, RedundancyPackageInputs } from "@shared/schema";
import { useEffect, useMemo, useState } from "react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { EssentialExpenseChips } from "@/components/wizard/essential-expense-chips";
import { FlexibleExpenseChips } from "@/components/wizard/flexible-expense-chips";
import { IncomeAssumptionChips } from "@/components/wizard/income-assumption-chips";

const STEPS = [
  { title: "Redundancy Package", description: "Enter your package details. UK statutory calculation is built in." },
  { title: "Your Current Situation", description: "Tell us about your circumstances so the model is framed correctly." },
  { title: "Capital Snapshot", description: "What savings and liquid assets are available to you right now?" },
  { title: "Income Assumptions", description: "What income do you expect during the gap period and after?" },
  { title: "Essential Expenses", description: "Your fixed monthly costs — the expenses that continue regardless." },
  { title: "Flexible Spending", description: "Discretionary and variable costs you may be able to adjust." },
  { title: "Preview Your Report", description: "Review your key assumptions before building the report." },
];

const STEP_META = [
  { category: "Package", icon: Briefcase, pillBg: "bg-cyan-100 dark:bg-cyan-500/20", pillText: "text-cyan-700 dark:text-cyan-200", borderTop: "border-t-cyan-400", dotBg: "bg-cyan-500", dotBorder: "border-cyan-500", shieldBorder: "border-l-cyan-300 dark:border-l-cyan-500", progressBar: "[&>div]:bg-cyan-500" },
  { category: "Situation", icon: Heart, pillBg: "bg-violet-100 dark:bg-violet-500/20", pillText: "text-violet-700 dark:text-violet-200", borderTop: "border-t-violet-400", dotBg: "bg-violet-500", dotBorder: "border-violet-500", shieldBorder: "border-l-violet-300 dark:border-l-violet-500", progressBar: "[&>div]:bg-violet-500" },
  { category: "Capital", icon: Wallet, pillBg: "bg-amber-100 dark:bg-amber-500/20", pillText: "text-amber-700 dark:text-amber-200", borderTop: "border-t-amber-400", dotBg: "bg-amber-500", dotBorder: "border-amber-500", shieldBorder: "border-l-amber-300 dark:border-l-amber-500", progressBar: "[&>div]:bg-amber-500" },
  { category: "Income", icon: TrendingUp, pillBg: "bg-emerald-100 dark:bg-emerald-500/20", pillText: "text-emerald-700 dark:text-emerald-200", borderTop: "border-t-emerald-400", dotBg: "bg-emerald-500", dotBorder: "border-emerald-500", shieldBorder: "border-l-emerald-300 dark:border-l-emerald-500", progressBar: "[&>div]:bg-emerald-500" },
  { category: "Essentials", icon: Receipt, pillBg: "bg-rose-100 dark:bg-rose-500/20", pillText: "text-rose-700 dark:text-rose-200", borderTop: "border-t-rose-400", dotBg: "bg-rose-500", dotBorder: "border-rose-500", shieldBorder: "border-l-rose-300 dark:border-l-rose-500", progressBar: "[&>div]:bg-rose-500" },
  { category: "Flexible", icon: Layers, pillBg: "bg-violet-100 dark:bg-violet-500/20", pillText: "text-violet-700 dark:text-violet-200", borderTop: "border-t-violet-400", dotBg: "bg-violet-500", dotBorder: "border-violet-500", shieldBorder: "border-l-violet-300 dark:border-l-violet-500", progressBar: "[&>div]:bg-violet-500" },
  { category: "Review", icon: CheckCircle, pillBg: "bg-emerald-100 dark:bg-emerald-500/20", pillText: "text-emerald-700 dark:text-emerald-200", borderTop: "border-t-emerald-400", dotBg: "bg-emerald-500", dotBorder: "border-emerald-500", shieldBorder: "border-l-emerald-300 dark:border-l-emerald-500", progressBar: "[&>div]:bg-emerald-500" },
];

const STEP_COPY = [
  { prompt: "Start with your redundancy package.", reassurance: "Best estimates work well here. If you have a confirmed offer, use the manual override. Statutory rules follow current GOV.UK caps." },
  { prompt: "Let's frame your situation.", reassurance: "This step provides context for your report. It does not change the financial projection — rough answers are fine, and you can edit later." },
  { prompt: "What capital is available to you right now?", reassurance: "Bank balances and accessible savings are enough — precision isn't required. The model compares your position to UK benchmarks for context only." },
  { prompt: "What income might you have during the gap?", reassurance: "Enter what you realistically expect, not what you hope for. Sector timelines below are historical context — they do not predict your job search." },
  { prompt: "Your essential monthly costs.", reassurance: "Fixed costs that continue regardless of employment. Tap quick-add tiles for typical UK figures, then adjust to your household." },
  { prompt: "Spending you may be able to adjust.", reassurance: "Under these assumptions, flexible costs can be modelled separately. Toggle off to see an essential-only runway." },
  { prompt: "Review your assumptions before building the report.", reassurance: "Take a moment to check the figures look right. When you're ready, your free preview is one click away." },
];

const WIZARD_STAGES = [
  { label: "Your Package", steps: [0], stageNum: 1 },
  { label: "Your Situation", steps: [1], stageNum: 2 },
  { label: "Your Finances", steps: [2, 3], stageNum: 3 },
  { label: "Your Runway", steps: [4, 5, 6], stageNum: 4 },
];

function CurrencyInput({ label, value, onChange, tooltip, id, required, onTouch }: {
  label: string; value: number; onChange: (v: number) => void; tooltip?: string; id: string; required?: boolean; onTouch?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id} className="text-sm">
          {label}
          {required && <span className="text-destructive ml-0.5" aria-hidden="true">*</span>}
        </Label>
        {tooltip && <FieldHelp text={tooltip} />}
      </div>
      <div className="relative">
        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          id={id}
          type="number"
          min={0}
          step="1"
          value={value || ""}
          onChange={(e) => {
            onTouch?.();
            onChange(Math.max(0, Number(e.target.value) || 0));
          }}
          onBlur={() => onTouch?.()}
          className="pl-8"
          placeholder="0"
          data-testid={`input-${id}`}
        />
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, tooltip, id, min = 0, max, placeholder }: {
  label: string; value: number; onChange: (v: number) => void; tooltip?: string; id: string; min?: number; max?: number; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id} className="text-sm">{label}</Label>
        {tooltip && <FieldHelp text={tooltip} />}
      </div>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value || ""}
        onChange={(e) => {
          let v = Number(e.target.value) || 0;
          v = Math.max(min, v);
          if (max !== undefined) v = Math.min(max, v);
          onChange(v);
        }}
        placeholder={placeholder || "0"}
        data-testid={`input-${id}`}
      />
    </div>
  );
}

function StepContext({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  const updateContext = (field: string, value: string | boolean) => {
    setInputs((prev: RunwayInputs) => ({ ...prev, context: { ...prev.context, [field]: value } }));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          This step provides context for your report. It does not affect the financial projection — it helps frame the assumptions correctly.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">What best describes your situation?</Label>
        <Select value={inputs.context.employmentStatus} onValueChange={(v) => updateContext("employmentStatus", v)}>
          <SelectTrigger data-testid="select-employmentStatus">
            <SelectValue placeholder="Select situation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="redundant">Made redundant</SelectItem>
            <SelectItem value="at_risk">At risk of redundancy</SelectItem>
            <SelectItem value="restructuring">Restructuring — role at risk</SelectItem>
            <SelectItem value="voluntary_redundancy">Considering voluntary redundancy</SelectItem>
            <SelectItem value="contract_ending">Contract ending</SelectItem>
            <SelectItem value="ai_automation_concern">AI or automation concern</SelectItem>
            <SelectItem value="other_disruption">Other income disruption</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Housing</Label>
        <Select value={inputs.context.housingType} onValueChange={(v) => updateContext("housingType", v)}>
          <SelectTrigger data-testid="select-housingType">
            <SelectValue placeholder="Select housing type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mortgage">Mortgage</SelectItem>
            <SelectItem value="renting">Renting</SelectItem>
            <SelectItem value="owned_outright">Owned outright</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Household</Label>
        <Select value={inputs.context.householdStructure} onValueChange={(v) => updateContext("householdStructure", v)}>
          <SelectTrigger data-testid="select-householdStructure">
            <SelectValue placeholder="Select household" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="couple">Couple</SelectItem>
            <SelectItem value="family">Family</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
        <div>
          <p className="text-sm font-medium">Financial dependents</p>
          <p className="text-xs text-muted-foreground">Children or others financially dependent on you</p>
        </div>
        <Switch
          checked={inputs.context.hasDependents}
          onCheckedChange={(v) => updateContext("hasDependents", v)}
          data-testid="switch-hasDependents"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">How are you feeling about this?</Label>
        <Select value={inputs.context.confidenceLevel} onValueChange={(v) => updateContext("confidenceLevel", v)}>
          <SelectTrigger data-testid="select-confidenceLevel">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="comfortable">Reasonably comfortable</SelectItem>
            <SelectItem value="uncertain">Uncertain</SelectItem>
            <SelectItem value="under_pressure">Under pressure</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function StepRedundancyPackage({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  return <RedundancyPackageCalculator inputs={inputs} setInputs={setInputs} hideUnlockTeaser />;
}

function StepCapital({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  const pkg = inputs.redundancyPackage;
  const redundancyTotal = useMemo(() => {
    if (pkg.useManualOverride && pkg.manualOverrideAmount > 0) return pkg.manualOverrideAmount;
    return computeRedundancyEstimate(pkg).totalEstimated;
  }, [pkg]);

  const total = inputs.cashSavings + inputs.liquidInvestments + redundancyTotal + inputs.otherOneOffIncome + (inputs.unpaidWages ?? 0);

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          These figures are used to build your report assumptions. The model does not provide financial, tax, legal or employment advice.
        </p>
      </div>

      <CurrencyInput label="Cash savings" value={inputs.cashSavings} onChange={(v) => setInputs({ cashSavings: v })} tooltip="Bank accounts, cash ISAs, and accessible savings" id="cashSavings" />
      <CurrencyInput label="Liquid investments" value={inputs.liquidInvestments} onChange={(v) => setInputs({ liquidInvestments: v })} tooltip="Stocks and shares ISAs, investment accounts you could realistically access" id="liquidInvestments" />
      <CurrencyInput label="Other one-off income" value={inputs.otherOneOffIncome} onChange={(v) => setInputs({ otherOneOffIncome: v })} tooltip="Any other lump sums expected (e.g. expected insurance payout, asset sale)" id="otherOneOffIncome" />

      <div className="rounded-md bg-muted/50 p-3 mt-4 space-y-1">
        <p className="text-xs text-muted-foreground">
          Redundancy package (from previous step): <span className="font-medium text-foreground">{formatGBP(redundancyTotal)}</span>
        </p>
        {(inputs.unpaidWages ?? 0) > 0 && (
          <p className="text-xs text-muted-foreground">
            Unpaid wages: <span className="font-medium text-foreground">{formatGBP(inputs.unpaidWages ?? 0)}</span>
          </p>
        )}
        <p className="text-sm font-medium" data-testid="text-starting-capital-preview">
          Starting capital: {formatGBP(total)}
        </p>
      </div>

      <div className="rounded-md border border-border/50 p-3 mt-3 space-y-1" data-testid="panel-savings-benchmark">
        <p className="text-xs font-medium text-foreground">UK Household Savings Benchmark</p>
        <p className="text-xs text-muted-foreground">
          UK median household savings: {formatGBP(ukBenchmarks.savingsBenchmarks.medianHouseholdSavings)} ({ukBenchmarks.savingsBenchmarks.year} data)
        </p>
        <p className="text-xs text-muted-foreground">
          Upper quartile threshold: {formatGBP(ukBenchmarks.savingsBenchmarks.upperQuartileThreshold)}+
        </p>
        <p className="text-xs text-muted-foreground/70 italic mt-1">
          Contextual national data. Your circumstances may differ significantly.
        </p>
      </div>
    </div>
  );
}

function StepIncome({ inputs, setInputs, onTouchField }: {
  inputs: RunwayInputs;
  setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void;
  onTouchField: (field: "currentMonthlyNetIncome") => void;
}) {
  const sectors = getAllSectors();
  const sectorData = useMemo(() => getSectorData(inputs.sector), [inputs.sector]);
  const ageBandData = useMemo(() => getAgeBandData(inputs.redundancyPackage.age), [inputs.redundancyPackage.age]);
  const partnerIncome = inputs.includePartnerIncome ? (inputs.partnerMonthlyNetIncome ?? 0) : 0;
  const gapIncome = inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate + partnerIncome;

  const effectiveMedianMonths = useMemo(() => {
    const combined = Math.round((sectorData.medianWeeks + ageBandData.medianWeeks) / 2);
    return Math.max(6, Math.round(weeksToMonths(combined)));
  }, [sectorData, ageBandData]);

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          These figures are used to build your report assumptions. The model does not provide financial, tax, legal or employment advice.
        </p>
      </div>

      <IncomeAssumptionChips onSelect={(patch) => setInputs(patch)} />

      <CurrencyInput
        label="Previous monthly net income"
        value={inputs.currentMonthlyNetIncome}
        onChange={(v) => setInputs({ currentMonthlyNetIncome: v })}
        onTouch={() => onTouchField("currentMonthlyNetIncome")}
        tooltip="Your previous take-home pay per month (used for scenario modelling). Enter £0 if you had no income."
        id="currentMonthlyNetIncome"
        required
      />
      <CurrencyInput label="Replacement monthly income (gap period)" value={inputs.replacementMonthlyIncome} onChange={(v) => setInputs({ replacementMonthlyIncome: v })} tooltip="Any current part-time, freelance, or gig income during the gap period" id="replacementMonthlyIncome" />
      <CurrencyInput label="Benefit support estimate" value={inputs.benefitSupportEstimate} onChange={(v) => setInputs({ benefitSupportEstimate: v })} tooltip="Estimated monthly benefits if applicable. Eligibility is not assessed here — use as a planning assumption." id="benefitSupportEstimate" />

      <div className="space-y-1.5">
        <Label htmlFor="sector" className="text-sm">Employment sector</Label>
        <Select value={inputs.sector} onValueChange={(v) => setInputs({ sector: v })}>
          <SelectTrigger data-testid="select-sector">
            <SelectValue placeholder="Select sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors (UK Average)</SelectItem>
            {sectors.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {inputs.sector && (
        <div className="rounded-md border border-border/50 p-3 space-y-2" data-testid="panel-reemployment-context">
          <p className="text-xs font-medium text-foreground">Reemployment Timeline — Historical Context</p>
          <p className="text-xs text-muted-foreground">
            Based on published UK labour market statistics for your sector and age group.
          </p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Faster outcome (25th percentile):</span>
              <span className="font-medium text-foreground" data-testid="text-p25-timeline">{formatWeeksAndMonths(Math.min(sectorData.p25Weeks, ageBandData.p25Weeks))}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Typical outcome (median):</span>
              <span className="font-medium text-foreground" data-testid="text-p50-timeline">{formatWeeksAndMonths(Math.round((sectorData.medianWeeks + ageBandData.medianWeeks) / 2))}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Slower outcome (75th percentile):</span>
              <span className="font-medium text-foreground" data-testid="text-p75-timeline">{formatWeeksAndMonths(Math.max(sectorData.p75Weeks, ageBandData.p75Weeks))}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/70 italic mt-2">
            Percentiles reflect historical outcomes and do not predict individual job search duration.
          </p>
          <p className="text-xs text-muted-foreground/70 italic">
            Source: {sectorData.source} ({sectorData.lastUpdated}). Age band: {ageBandData.ageBand}.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="monthsUntilNewJob" className="text-sm">Months until previous income level resumes (estimate)</Label>
          <FieldHelp text="How long you estimate until your previous income level resumes. Used as a planning assumption for the model — not a prediction." />
        </div>
        <Input
          id="monthsUntilNewJob"
          type="number"
          min={0}
          max={60}
          value={inputs.monthsUntilNewJob || ""}
          onChange={(e) => setInputs({ monthsUntilNewJob: Math.max(0, Math.min(60, Number(e.target.value) || 0)) })}
          placeholder="6"
          data-testid="input-monthsUntilNewJob"
        />
        <p className="text-xs text-muted-foreground">After this period, the model assumes your previous income level resumes</p>
        {inputs.sector && (
          <Button
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={() => setInputs({ monthsUntilNewJob: effectiveMedianMonths })}
            data-testid="button-set-typical-timeline"
            title="Applies the median timeline for your sector and age group to your planning assumptions."
          >
            Set Typical Timeline as Assumption
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-2 border-t">
        <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
          <div>
            <p className="text-sm font-medium">Include partner income</p>
            <p className="text-xs text-muted-foreground">Add a partner or household income to the runway model</p>
          </div>
          <Switch
            checked={inputs.includePartnerIncome}
            onCheckedChange={(v) => setInputs({ includePartnerIncome: v })}
            data-testid="switch-includePartnerIncome"
          />
        </div>

        {inputs.includePartnerIncome && (
          <CurrencyInput
            label="Partner monthly net income"
            value={inputs.partnerMonthlyNetIncome ?? 0}
            onChange={(v) => setInputs({ partnerMonthlyNetIncome: v })}
            id="partnerMonthlyNetIncome"
            tooltip="Your partner's monthly take-home pay. This is added to the household income throughout the entire projection period."
          />
        )}
      </div>

      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          Monthly income during gap period: <span className="font-medium text-foreground" data-testid="text-gap-income-preview">
            {formatGBP(gapIncome)}
          </span>
          {inputs.includePartnerIncome && (inputs.partnerMonthlyNetIncome ?? 0) > 0 && (
            <span className="text-muted-foreground"> (includes partner income)</span>
          )}
        </p>
      </div>
    </div>
  );
}

function StepEssential({ inputs, setInputs, onTouchField }: {
  inputs: RunwayInputs;
  setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void;
  onTouchField: (field: "mortgageOrRent") => void;
}) {
  const total = inputs.mortgageOrRent + inputs.utilities + inputs.food + inputs.councilTax + inputs.insurance + inputs.transport + inputs.debtRepayments + inputs.childcare + inputs.otherEssential;
  const housingPercent = total > 0 ? ((inputs.mortgageOrRent / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">Enter monthly amounts for fixed costs that continue regardless of employment status. Use best estimates.</p>
      </div>
      <EssentialExpenseChips
        inputs={inputs}
        onApply={(field, value) => setInputs({ [field]: value })}
      />

      <CurrencyInput
        label="Mortgage or rent"
        value={inputs.mortgageOrRent}
        onChange={(v) => setInputs({ mortgageOrRent: v })}
        onTouch={() => onTouchField("mortgageOrRent")}
        id="mortgageOrRent"
        required
        tooltip="Enter £0 if you have no mortgage or rent cost."
      />
      <CurrencyInput label="Council tax" value={inputs.councilTax} onChange={(v) => setInputs({ councilTax: v })} id="councilTax" tooltip="Monthly council tax payment. Divide your annual bill by 10 (council tax is typically paid over 10 months)." />
      <CurrencyInput label="Utilities" value={inputs.utilities} onChange={(v) => setInputs({ utilities: v })} tooltip="Gas, electricity, water, broadband, phone" id="utilities" />
      <CurrencyInput label="Food & groceries" value={inputs.food} onChange={(v) => setInputs({ food: v })} id="food" />
      <CurrencyInput label="Insurance" value={inputs.insurance} onChange={(v) => setInputs({ insurance: v })} tooltip="Home, car, life, health insurance" id="insurance" />
      <CurrencyInput label="Transport" value={inputs.transport} onChange={(v) => setInputs({ transport: v })} tooltip="Fuel, public transport, car finance/lease" id="transport" />
      <CurrencyInput label="Debt repayments" value={inputs.debtRepayments} onChange={(v) => setInputs({ debtRepayments: v })} tooltip="Credit cards, personal loans, hire purchase agreements" id="debtRepayments" />
      <CurrencyInput label="Childcare" value={inputs.childcare} onChange={(v) => setInputs({ childcare: v })} id="childcare" />
      <CurrencyInput label="Other essential" value={inputs.otherEssential} onChange={(v) => setInputs({ otherEssential: v })} id="otherEssential" />
      <div className="rounded-md bg-muted/50 p-3 mt-2 space-y-1">
        <p className="text-xs text-muted-foreground">
          Essential total: <span className="font-medium text-foreground" data-testid="text-essential-total">{formatGBP(total)}/mo</span>
        </p>
        {total > 0 && (
          <>
            <p className="text-xs text-muted-foreground" data-testid="text-housing-percent">
              Your housing represents {housingPercent}% of essential expenses.
            </p>
            <p className="text-xs text-muted-foreground">
              UK typical housing burden ~{ukBenchmarks.housingBurden.typicalBurdenPercent}% of net income (ONS, {ukBenchmarks.housingBurden.year}).
            </p>
            {Number(housingPercent) > ukBenchmarks.housingBurden.stressReferenceThresholdPercent && (
              <p className="text-xs text-muted-foreground">
                Model reference threshold: {ukBenchmarks.housingBurden.stressReferenceThresholdPercent}% (contextual indicator only).
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StepFlexible({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  const total = inputs.subscriptions + inputs.leisure + inputs.travel + inputs.discretionaryOther + (inputs.retrainingMonthlyCost ?? 0);
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">These figures are used to build your report assumptions. The model does not provide financial, tax, legal or employment advice.</p>
      </div>
      <FlexibleExpenseChips inputs={inputs} onApply={(patch) => setInputs(patch)} />

      <CurrencyInput label="Subscriptions" value={inputs.subscriptions} onChange={(v) => setInputs({ subscriptions: v })} tooltip="Streaming, gym, magazines, software" id="subscriptions" />
      <CurrencyInput label="Leisure & entertainment" value={inputs.leisure} onChange={(v) => setInputs({ leisure: v })} tooltip="Eating out, entertainment, hobbies" id="leisure" />
      <CurrencyInput label="Travel & holidays" value={inputs.travel} onChange={(v) => setInputs({ travel: v })} id="travel" />
      <CurrencyInput label="Retraining or reskilling costs" value={inputs.retrainingMonthlyCost ?? 0} onChange={(v) => setInputs({ retrainingMonthlyCost: v })} tooltip="Monthly costs for courses, certifications, or reskilling. These are included in the flexible spending total." id="retrainingMonthlyCost" />
      <CurrencyInput label="Other discretionary" value={inputs.discretionaryOther} onChange={(v) => setInputs({ discretionaryOther: v })} id="discretionaryOther" />

      <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
        <div>
          <p className="text-sm font-medium">Include flexible spending</p>
          <p className="text-xs text-muted-foreground">Toggle off to model essential-only expenses</p>
        </div>
        <Switch
          checked={inputs.includeNonEssential}
          onCheckedChange={(v) => setInputs({ includeNonEssential: v })}
          data-testid="switch-includeNonEssential"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="emergencyBuffer" className="text-sm">Emergency buffer</Label>
          <FieldHelp text="Minimum capital you want to keep as a buffer. The model will flag when capital approaches this level." />
        </div>
        <div className="relative">
          <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            id="emergencyBuffer"
            type="number"
            min={0}
            value={inputs.emergencyBuffer || ""}
            onChange={(e) => setInputs({ emergencyBuffer: Math.max(0, Number(e.target.value) || 0) })}
            className="pl-8"
            placeholder="5000"
            data-testid="input-emergencyBuffer"
          />
        </div>
      </div>

      <div className="rounded-md bg-muted/50 p-3 space-y-1">
        <p className="text-xs text-muted-foreground">
          Flexible spending total: <span className="font-medium text-foreground" data-testid="text-flexible-total">{formatGBP(total)}/mo</span>
        </p>
      </div>
    </div>
  );
}

function StepReview({ inputs, onEditStep }: { inputs: RunwayInputs; onEditStep: (step: number) => void }) {
  const pkg = inputs.redundancyPackage;
  const estimate = useMemo(() => computeRedundancyEstimate(pkg), [pkg]);
  const redundancyTotal = pkg.useManualOverride && pkg.manualOverrideAmount > 0 ? pkg.manualOverrideAmount : estimate.totalEstimated;
  const partnerIncome = inputs.includePartnerIncome ? (inputs.partnerMonthlyNetIncome ?? 0) : 0;
  const gapIncome = inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate + partnerIncome;
  const essentialTotal = inputs.mortgageOrRent + inputs.utilities + inputs.food + inputs.councilTax + inputs.insurance + inputs.transport + inputs.debtRepayments + inputs.childcare + inputs.otherEssential;
  const flexTotal = inputs.subscriptions + inputs.leisure + inputs.travel + inputs.discretionaryOther + (inputs.retrainingMonthlyCost ?? 0);
  const startingCapital = inputs.cashSavings + inputs.liquidInvestments + redundancyTotal + inputs.otherOneOffIncome + (inputs.unpaidWages ?? 0);

  const summaryRows: { label: string; value: string; editStep?: number }[] = [
    { label: "Starting capital", value: formatGBP(startingCapital), editStep: 2 },
    { label: "Redundancy package", value: formatGBP(redundancyTotal), editStep: 0 },
    { label: "Monthly essential expenses", value: formatGBP(essentialTotal) + "/mo", editStep: 4 },
    { label: "Monthly flexible spending", value: formatGBP(flexTotal) + "/mo", editStep: 5 },
    { label: "Gap period income", value: formatGBP(gapIncome) + "/mo", editStep: 3 },
    { label: "Months until income resumes", value: inputs.monthsUntilNewJob > 0 ? `${inputs.monthsUntilNewJob} months` : "Not set", editStep: 3 },
    { label: "Emergency buffer", value: formatGBP(inputs.emergencyBuffer), editStep: 5 },
  ];

  const situationLabels: Record<string, string> = {
    redundant: "Made redundant",
    at_risk: "At risk of redundancy",
    restructuring: "Restructuring",
    voluntary_redundancy: "Voluntary redundancy",
    contract_ending: "Contract ending",
    ai_automation_concern: "AI / automation concern",
    other_disruption: "Other income disruption",
  };

  return (
    <div className="space-y-4">
      <PackageTotalHero inputs={inputs} showCta={false} />

      <div className="rounded-md bg-primary/8 border border-primary/15 p-3">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Your assumptions are ready. Review the summary below, then build your free preview.
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2 py-2 border-b text-xs">
          <span className="text-muted-foreground">Situation</span>
          <span className="font-medium">{situationLabels[inputs.context.employmentStatus] ?? inputs.context.employmentStatus}</span>
        </div>
        {summaryRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2 py-2.5 border-b text-sm last:border-0 group">
            <span className="text-muted-foreground">{row.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium tabular-nums" data-testid={`review-${row.label.toLowerCase().replace(/\s+/g, "-")}`}>{row.value}</span>
              {row.editStep !== undefined && (
                <button type="button" onClick={() => onEditStep(row.editStep!)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary" data-testid={`edit-${row.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Pencil className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
        {inputs.includePartnerIncome && (inputs.partnerMonthlyNetIncome ?? 0) > 0 && (
          <div className="flex items-center justify-between gap-2 py-2 border-b text-xs">
            <span className="text-muted-foreground">Partner income included</span>
            <span className="font-medium">{formatGBP(inputs.partnerMonthlyNetIncome ?? 0)}/mo</span>
          </div>
        )}
      </div>

      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          All outputs are assumption-based and do not constitute financial, legal, tax or employment advice. Figures are illustrative only.
        </p>
      </div>
    </div>
  );
}

function getValidationWarnings(inputs: RunwayInputs, step: number): string[] {
  const warnings: string[] = [];
  if (step === 0) {
    if (!inputs.redundancyPackage.weeklyGrossPay && !inputs.redundancyPackage.useManualOverride) {
      warnings.push("Weekly gross pay is £0 — statutory redundancy will be £0. Add your weekly pay or use manual override.");
    }
  }
  if (step === 2) {
    if (inputs.cashSavings === 0 && inputs.liquidInvestments === 0) {
      warnings.push("Both savings fields are £0 — the starting capital will be based on the redundancy package only.");
    }
  }
  if (step === 3) {
    if (inputs.currentMonthlyNetIncome === 0) {
      warnings.push("Previous monthly income is £0 — scenario comparisons may not reflect your situation.");
    }
  }
  if (step === 4) {
    if (inputs.mortgageOrRent === 0 && inputs.food === 0 && inputs.utilities === 0) {
      warnings.push("All essential expenses are £0 — the runway estimate may be unrealistically high.");
    }
  }
  return warnings;
}

type WizardTouchedFields = {
  currentMonthlyNetIncome: boolean;
  mortgageOrRent: boolean;
};

function getStepErrors(_inputs: RunwayInputs, step: number, touched: WizardTouchedFields): string[] {
  const errors: string[] = [];
  if (step === 3 && !touched.currentMonthlyNetIncome) {
    errors.push("Enter your previous monthly net income before continuing — £0 is fine if you had no income.");
  }
  if (step === 4 && !touched.mortgageOrRent) {
    errors.push("Enter your mortgage or rent before continuing — £0 is fine if not applicable.");
  }
  return errors;
}

export default function WizardPage() {
  const [, navigate] = useLocation();
  const { inputs, setInputs, step, setStep } = useWizardStore();
  const [touchedFields, setTouchedFields] = useState<WizardTouchedFields>({
    currentMonthlyNetIncome: false,
    mortgageOrRent: false,
  });

  const markTouched = (field: keyof WizardTouchedFields) => {
    setTouchedFields((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step");
    if (stepParam == null) return;
    const parsed = Number.parseInt(stepParam, 10);
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < STEPS.length) {
      setStep(parsed);
    }
  }, [setStep]);

  const totalSteps = STEPS.length;

  const warnings = useMemo(() => getValidationWarnings(inputs, step), [inputs, step]);
  const stepErrors = useMemo(() => getStepErrors(inputs, step, touchedFields), [inputs, step, touchedFields]);

  function handleNext() {
    if (stepErrors.length > 0) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }
    if (step < totalSteps - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/preview");
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  }

  const stepComponents = [
    <StepRedundancyPackage key={0} inputs={inputs} setInputs={setInputs} />,
    <StepContext key={1} inputs={inputs} setInputs={setInputs} />,
    <StepCapital key={2} inputs={inputs} setInputs={setInputs} />,
    <StepIncome key={3} inputs={inputs} setInputs={setInputs} onTouchField={markTouched} />,
    <StepEssential key={4} inputs={inputs} setInputs={setInputs} onTouchField={markTouched} />,
    <StepFlexible key={5} inputs={inputs} setInputs={setInputs} />,
    <StepReview key={6} inputs={inputs} onEditStep={setStep} />,
  ];

  const warningsBlock = (warnings.length > 0 || stepErrors.length > 0) ? (
    <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
      {stepErrors.map((w, i) => (
        <div key={`err-${i}`} className="flex items-start gap-2 text-xs text-destructive font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{w}</span>
        </div>
      ))}
      {warnings.map((w, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>{w}</span>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <>
      <Helmet>
        <title>Build Your Redundancy Report — RedundancyCalculatorUK</title>
        <meta name="description" content="Enter your redundancy package, savings, income assumptions and monthly costs to build your private financial runway report. UK statutory calculation built in." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.redundancycalculatoruk.co.uk/wizard" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content="Build Your Redundancy Report — RedundancyCalculatorUK" />
        <meta property="og:description" content="Enter your redundancy package, savings, income assumptions and monthly costs to build your private financial runway report." />
        <meta property="og:url" content="https://www.redundancycalculatoruk.co.uk/wizard" />
        <meta property="og:image" content="https://www.redundancycalculatoruk.co.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Build Your Redundancy Report — RedundancyCalculatorUK" />
        <meta name="twitter:description" content="Enter your redundancy package, savings, income assumptions and monthly costs to build your private financial runway report." />
        <meta name="twitter:image" content="https://www.redundancycalculatoruk.co.uk/og-image.png" />
      </Helmet>
      <DisclaimerBanner />
      <WizardShell
        step={step}
        totalSteps={totalSteps}
        steps={STEPS}
        stepMeta={STEP_META}
        wizardStages={WIZARD_STAGES}
        prompt={STEP_COPY[step].prompt}
        reassurance={STEP_COPY[step].reassurance}
        onStepClick={setStep}
        warnings={warningsBlock}
        footer={
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={handleBack} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} className="btn-gold" data-testid="button-next">
              {step === totalSteps - 1 ? "Build my report" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        }
      >
        {stepComponents[step]}
      </WizardShell>
    </>
  );
}
