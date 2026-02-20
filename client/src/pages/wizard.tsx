import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, PoundSterling, Info, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWizardStore } from "@/lib/wizardStore";
import { getAllSectors, getSectorData } from "@/lib/sectorData";
import { formatGBP, computeRedundancyEstimate } from "@/lib/engine";
import { ukBenchmarks, getAgeBandData, formatWeeksAndMonths, weeksToMonths } from "@/lib/ukBenchmarks";
import type { RunwayInputs, RedundancyPackageInputs } from "@shared/schema";
import { useMemo } from "react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Logo } from "@/components/Logo";

const STEPS = [
  { title: "Your Current Position", description: "Contextual information about your circumstances" },
  { title: "Redundancy Package", description: "Statutory and contractual entitlements" },
  { title: "Capital Snapshot", description: "Accessible savings and one-off income" },
  { title: "Income Assumptions", description: "Current and expected replacement income" },
  { title: "Essential Expenses", description: "Fixed monthly costs" },
  { title: "Flexible Spending Assumptions", description: "Discretionary monthly spending" },
];

function CurrencyInput({ label, value, onChange, tooltip, id }: {
  label: string; value: number; onChange: (v: number) => void; tooltip?: string; id: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id} className="text-sm">{label}</Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="relative">
        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          id={id}
          type="number"
          min={0}
          step="1"
          value={value || ""}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
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
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
          </Tooltip>
        )}
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
      <div className="space-y-1.5">
        <Label className="text-sm">Employment Status</Label>
        <Select value={inputs.context.employmentStatus} onValueChange={(v) => updateContext("employmentStatus", v)}>
          <SelectTrigger data-testid="select-employmentStatus">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="redundant">Redundant</SelectItem>
            <SelectItem value="at_risk">At Risk of Redundancy</SelectItem>
            <SelectItem value="other_disruption">Other Disruption</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Housing Type</Label>
        <Select value={inputs.context.housingType} onValueChange={(v) => updateContext("housingType", v)}>
          <SelectTrigger data-testid="select-housingType">
            <SelectValue placeholder="Select housing type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mortgage">Mortgage</SelectItem>
            <SelectItem value="renting">Renting</SelectItem>
            <SelectItem value="owned_outright">Owned Outright</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Household Structure</Label>
        <Select value={inputs.context.householdStructure} onValueChange={(v) => updateContext("householdStructure", v)}>
          <SelectTrigger data-testid="select-householdStructure">
            <SelectValue placeholder="Select structure" />
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
          <p className="text-sm font-medium">Dependents</p>
          <p className="text-xs text-muted-foreground">Do you have financial dependents?</p>
        </div>
        <Switch
          checked={inputs.context.hasDependents}
          onCheckedChange={(v) => updateContext("hasDependents", v)}
          data-testid="switch-hasDependents"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Confidence Level</Label>
        <Select value={inputs.context.confidenceLevel} onValueChange={(v) => updateContext("confidenceLevel", v)}>
          <SelectTrigger data-testid="select-confidenceLevel">
            <SelectValue placeholder="Select confidence level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="comfortable">Comfortable</SelectItem>
            <SelectItem value="uncertain">Uncertain</SelectItem>
            <SelectItem value="under_pressure">Under Pressure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md bg-muted/50 p-3 mt-4">
        <p className="text-xs text-muted-foreground">
          This information provides context only and does not affect the financial projection.
        </p>
      </div>
    </div>
  );
}

function StepRedundancyPackage({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  const pkg = inputs.redundancyPackage;

  const updatePkg = (field: string, value: number | boolean) => {
    setInputs((prev: RunwayInputs) => ({ ...prev, redundancyPackage: { ...prev.redundancyPackage, [field]: value } }));
  };

  const estimate = useMemo(() => computeRedundancyEstimate(pkg), [pkg]);

  return (
    <div className="space-y-4">
      <NumberInput label="Age" value={pkg.age} onChange={(v) => updatePkg("age", v)} id="age" min={16} max={100} placeholder="35" />
      <NumberInput label="Years of Service" value={pkg.yearsOfService} onChange={(v) => updatePkg("yearsOfService", v)} id="yearsOfService" min={0} max={20} tooltip="Complete years of continuous employment (capped at 20 for statutory calculation)" placeholder="5" />
      <CurrencyInput label="Weekly Gross Pay" value={pkg.weeklyGrossPay} onChange={(v) => updatePkg("weeklyGrossPay", v)} id="weeklyGrossPay" tooltip="Gross weekly pay before deductions. Statutory cap of £643/week applies to redundancy calculation." />
      <NumberInput label="Notice Period (weeks)" value={pkg.noticeWeeks} onChange={(v) => updatePkg("noticeWeeks", v)} id="noticeWeeks" min={0} max={52} tooltip="Contractual or statutory notice period in weeks" />
      <NumberInput label="Accrued Holiday (weeks)" value={pkg.holidayWeeks} onChange={(v) => updatePkg("holidayWeeks", v)} id="holidayWeeks" min={0} max={10} tooltip="Untaken holiday entitlement to be paid out" />

      <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
        <div>
          <p className="text-sm font-medium">Enhanced Package</p>
          <p className="text-xs text-muted-foreground">Employer offering above statutory redundancy</p>
        </div>
        <Switch
          checked={pkg.enhancedPackage}
          onCheckedChange={(v) => updatePkg("enhancedPackage", v)}
          data-testid="switch-enhancedPackage"
        />
      </div>

      {pkg.enhancedPackage && (
        <CurrencyInput label="Enhanced Redundancy Amount" value={pkg.enhancedAmount} onChange={(v) => updatePkg("enhancedAmount", v)} id="enhancedAmount" tooltip="Total enhanced redundancy payment offered by employer (replaces statutory redundancy element)" />
      )}

      <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
        <div>
          <p className="text-sm font-medium">Use actual package amount instead</p>
          <p className="text-xs text-muted-foreground">Override the estimated calculation with a known total</p>
        </div>
        <Switch
          checked={pkg.useManualOverride}
          onCheckedChange={(v) => updatePkg("useManualOverride", v)}
          data-testid="switch-useManualOverride"
        />
      </div>

      {pkg.useManualOverride && (
        <CurrencyInput label="Actual Package Amount" value={pkg.manualOverrideAmount} onChange={(v) => updatePkg("manualOverrideAmount", v)} id="manualOverrideAmount" tooltip="The total redundancy package amount you have been offered or received" />
      )}

      <div className="rounded-md bg-muted/50 p-3 mt-4 space-y-2">
        <p className="text-sm font-medium" data-testid="text-redundancy-total">
          Estimated redundancy total under statutory assumptions: {formatGBP(estimate.totalEstimated)}
        </p>
        <p className="text-xs text-muted-foreground" data-testid="text-redundancy-breakdown">
          Statutory redundancy: {formatGBP(estimate.statutoryRedundancy)} | Notice pay: {formatGBP(estimate.noticePay)} | Holiday pay: {formatGBP(estimate.holidayPay)}
        </p>
        <p className="text-xs text-muted-foreground">
          The first £{estimate.taxFreeThreshold.toLocaleString()} of statutory redundancy pay is assumed to be tax-free. This is a simplified assumption and does not constitute tax advice.
        </p>
      </div>
    </div>
  );
}

function StepCapital({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  const pkg = inputs.redundancyPackage;
  const redundancyTotal = useMemo(() => {
    if (pkg.useManualOverride && pkg.manualOverrideAmount > 0) return pkg.manualOverrideAmount;
    return computeRedundancyEstimate(pkg).totalEstimated;
  }, [pkg]);

  const total = inputs.cashSavings + inputs.liquidInvestments + redundancyTotal + inputs.otherOneOffIncome;

  return (
    <div className="space-y-4">
      <CurrencyInput label="Cash Savings" value={inputs.cashSavings} onChange={(v) => setInputs({ cashSavings: v })} tooltip="Bank accounts, cash ISAs, and accessible savings" id="cashSavings" />
      <CurrencyInput label="Liquid Investments" value={inputs.liquidInvestments} onChange={(v) => setInputs({ liquidInvestments: v })} tooltip="Stocks and shares ISAs, investment accounts you could access" id="liquidInvestments" />
      <CurrencyInput label="Other One-Off Income" value={inputs.otherOneOffIncome} onChange={(v) => setInputs({ otherOneOffIncome: v })} tooltip="Any other lump sums expected" id="otherOneOffIncome" />

      <div className="rounded-md bg-muted/50 p-3 mt-4 space-y-1">
        <p className="text-xs text-muted-foreground">
          Redundancy total (from previous step): <span className="font-medium text-foreground">{formatGBP(redundancyTotal)}</span>
        </p>
        <p className="text-sm font-medium" data-testid="text-starting-capital-preview">
          Starting Capital: {formatGBP(total)}
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
          Contextual national data. Your circumstances may differ.
        </p>
      </div>
    </div>
  );
}

function StepIncome({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  const sectors = getAllSectors();
  const sectorData = useMemo(() => getSectorData(inputs.sector), [inputs.sector]);
  const ageBandData = useMemo(() => getAgeBandData(inputs.redundancyPackage.age), [inputs.redundancyPackage.age]);
  const gapIncome = inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate;

  const effectiveMedianMonths = useMemo(() => {
    const combined = Math.round((sectorData.medianWeeks + ageBandData.medianWeeks) / 2);
    return Math.max(1, Math.round(weeksToMonths(combined)));
  }, [sectorData, ageBandData]);

  return (
    <div className="space-y-4">
      <CurrencyInput label="Previous Monthly Net Income" value={inputs.currentMonthlyNetIncome} onChange={(v) => setInputs({ currentMonthlyNetIncome: v })} tooltip="Your previous take-home pay per month (used for scenario modelling)" id="currentMonthlyNetIncome" />
      <CurrencyInput label="Replacement Monthly Income" value={inputs.replacementMonthlyIncome} onChange={(v) => setInputs({ replacementMonthlyIncome: v })} tooltip="Any current part-time, freelance, or gig income during the gap period" id="replacementMonthlyIncome" />
      <CurrencyInput label="Benefit Support Estimate" value={inputs.benefitSupportEstimate} onChange={(v) => setInputs({ benefitSupportEstimate: v })} tooltip="Estimated monthly benefits if applicable. Eligibility not assessed here." id="benefitSupportEstimate" />

      <div className="space-y-1.5">
        <Label htmlFor="sector" className="text-sm">Employment Sector</Label>
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
          <p className="text-xs font-medium text-foreground">Reemployment Timeline (Historical Context)</p>
          <p className="text-xs text-muted-foreground">
            Based on published UK labour market statistics for your selected sector and age group.
          </p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Faster Outcome (25th percentile):</span>
              <span className="font-medium text-foreground" data-testid="text-p25-timeline">{formatWeeksAndMonths(Math.min(sectorData.p25Weeks, ageBandData.p25Weeks))}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Typical Outcome (Median):</span>
              <span className="font-medium text-foreground" data-testid="text-p50-timeline">{formatWeeksAndMonths(Math.round((sectorData.medianWeeks + ageBandData.medianWeeks) / 2))}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Slower Outcome (75th percentile):</span>
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
          <Label htmlFor="monthsUntilNewJob" className="text-sm">Months Until New Income (estimate)</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">How long you estimate until your previous income level resumes. Used for scenario modelling.</TooltipContent>
          </Tooltip>
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
        <p className="text-xs text-muted-foreground">After this period, projection assumes previous income resumes</p>
        {inputs.sector && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={() => setInputs({ monthsUntilNewJob: effectiveMedianMonths })}
                data-testid="button-set-typical-timeline"
              >
                Set Typical Timeline as Assumption
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              Applies the median timeline to your projection assumptions.
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          Monthly income during gap: <span className="font-medium text-foreground" data-testid="text-gap-income-preview">
            {formatGBP(gapIncome)}
          </span>
        </p>
      </div>
    </div>
  );
}

function StepEssential({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  const total = inputs.mortgageOrRent + inputs.utilities + inputs.food + inputs.insurance + inputs.transport + inputs.debtRepayments + inputs.childcare + inputs.otherEssential;
  const housingPercent = total > 0 ? ((inputs.mortgageOrRent / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Enter monthly amounts for essential fixed costs</p>
      <CurrencyInput label="Mortgage or Rent" value={inputs.mortgageOrRent} onChange={(v) => setInputs({ mortgageOrRent: v })} id="mortgageOrRent" />
      <CurrencyInput label="Utilities" value={inputs.utilities} onChange={(v) => setInputs({ utilities: v })} tooltip="Gas, electric, water, broadband, phone" id="utilities" />
      <CurrencyInput label="Food & Groceries" value={inputs.food} onChange={(v) => setInputs({ food: v })} id="food" />
      <CurrencyInput label="Insurance" value={inputs.insurance} onChange={(v) => setInputs({ insurance: v })} tooltip="Home, car, life, health insurance" id="insurance" />
      <CurrencyInput label="Transport" value={inputs.transport} onChange={(v) => setInputs({ transport: v })} tooltip="Fuel, public transport, car finance" id="transport" />
      <CurrencyInput label="Debt Repayments" value={inputs.debtRepayments} onChange={(v) => setInputs({ debtRepayments: v })} tooltip="Credit cards, loans, HP agreements" id="debtRepayments" />
      <CurrencyInput label="Childcare" value={inputs.childcare} onChange={(v) => setInputs({ childcare: v })} id="childcare" />
      <CurrencyInput label="Other Essential" value={inputs.otherEssential} onChange={(v) => setInputs({ otherEssential: v })} id="otherEssential" />
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
  const total = inputs.subscriptions + inputs.leisure + inputs.travel + inputs.discretionaryOther;
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Enter monthly amounts for discretionary spending</p>
      <CurrencyInput label="Subscriptions" value={inputs.subscriptions} onChange={(v) => setInputs({ subscriptions: v })} tooltip="Streaming, gym, magazines, software" id="subscriptions" />
      <CurrencyInput label="Leisure" value={inputs.leisure} onChange={(v) => setInputs({ leisure: v })} tooltip="Eating out, entertainment, hobbies" id="leisure" />
      <CurrencyInput label="Travel & Holidays" value={inputs.travel} onChange={(v) => setInputs({ travel: v })} id="travel" />
      <CurrencyInput label="Other Discretionary" value={inputs.discretionaryOther} onChange={(v) => setInputs({ discretionaryOther: v })} id="discretionaryOther" />
      <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
        <div>
          <p className="text-sm font-medium">Include non-essential in burn rate</p>
          <p className="text-xs text-muted-foreground">Toggle off to see projection with essential costs only</p>
        </div>
        <Switch
          checked={inputs.includeNonEssential}
          onCheckedChange={(v) => setInputs({ includeNonEssential: v })}
          data-testid="switch-includeNonEssential"
        />
      </div>
      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          Non-essential total: <span className="font-medium text-foreground" data-testid="text-nonessential-total">{formatGBP(total)}/mo</span>
        </p>
      </div>
    </div>
  );
}

function getValidationWarnings(inputs: RunwayInputs, step: number): string[] {
  const warnings: string[] = [];

  if (step === 2) {
    const pkg = inputs.redundancyPackage;
    const redundancyTotal = (pkg.useManualOverride && pkg.manualOverrideAmount > 0)
      ? pkg.manualOverrideAmount
      : computeRedundancyEstimate(pkg).totalEstimated;
    const total = inputs.cashSavings + inputs.liquidInvestments + redundancyTotal + inputs.otherOneOffIncome;
    if (total === 0) {
      warnings.push("Starting capital is zero. The projection assumes no savings or redundancy proceeds are available.");
    }
  }

  if (step === 4) {
    const essential = inputs.mortgageOrRent + inputs.utilities + inputs.food + inputs.insurance + inputs.transport + inputs.debtRepayments + inputs.childcare + inputs.otherEssential;
    if (essential === 0) {
      warnings.push("No essential expenses entered. The projection may not reflect realistic living costs.");
    }
    if (inputs.food === 0 && essential > 0) {
      warnings.push("Food & groceries is zero. Consider entering an estimate for a more realistic projection.");
    }
  }

  return warnings;
}

export default function WizardPage() {
  const [, navigate] = useLocation();
  const { inputs, setInputs, step, setStep } = useWizardStore();

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const warnings = useMemo(() => getValidationWarnings(inputs, step), [inputs, step]);

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      navigate("/preview");
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  }

  const stepComponents = [
    <StepContext key={0} inputs={inputs} setInputs={setInputs} />,
    <StepRedundancyPackage key={1} inputs={inputs} setInputs={setInputs} />,
    <StepCapital key={2} inputs={inputs} setInputs={setInputs} />,
    <StepIncome key={3} inputs={inputs} setInputs={setInputs} />,
    <StepEssential key={4} inputs={inputs} setInputs={setInputs} />,
    <StepFlexible key={5} inputs={inputs} setInputs={setInputs} />,
  ];

  return (
    <div className="min-h-screen">
      <DisclaimerBanner />
      <header className="flex items-center justify-between gap-4 px-6 py-4 border-b flex-wrap" data-testid="wizard-header">
        <Logo />
        <Badge variant="outline" className="text-xs" data-testid="badge-header-step">
          Step {step + 1} of {totalSteps}
        </Badge>
      </header>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
            <p className="text-xs text-muted-foreground" data-testid="text-step-indicator">
              Step {step + 1} of {totalSteps}
            </p>
            <Badge variant="outline" className="text-xs">{STEPS[step].title}</Badge>
          </div>
          <Progress value={progress} className="h-1.5" data-testid="progress-bar" />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg">{STEPS[step].title}</CardTitle>
            <p className="text-sm text-muted-foreground">{STEPS[step].description}</p>
          </CardHeader>
          <CardContent className="pt-4">
            {stepComponents[step]}
          </CardContent>
        </Card>

        {warnings.length > 0 && (
          <div className="mt-3 rounded-md bg-muted/50 border border-yellow-500/20 p-3">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mt-6">
          <Button variant="outline" onClick={handleBack} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} data-testid="button-next">
            {step === totalSteps - 1 ? "View Projection" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Use best estimates. Assumptions can be refined later.
        </p>
      </div>
    </div>
  );
}
