import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, PoundSterling, Info, AlertTriangle, CheckCircle } from "lucide-react";
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
  { title: "Your Current Situation", description: "Tell us about your circumstances so the model is framed correctly." },
  { title: "Redundancy Package", description: "Enter your package details. UK statutory calculation is built in." },
  { title: "Capital Snapshot", description: "What savings and liquid assets are available to you right now?" },
  { title: "Income Assumptions", description: "What income do you expect during the gap period and after?" },
  { title: "Essential Expenses", description: "Your fixed monthly costs — the expenses that continue regardless." },
  { title: "Flexible Spending", description: "Discretionary and variable costs you may be able to adjust." },
  { title: "Preview Your Report", description: "Review your key assumptions before building the report." },
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
  const pkg = inputs.redundancyPackage;
  const isVoluntaryRedundancy = inputs.context.employmentStatus === "voluntary_redundancy";

  const updatePkg = (field: string, value: number | boolean) => {
    setInputs((prev: RunwayInputs) => ({ ...prev, redundancyPackage: { ...prev.redundancyPackage, [field]: value } }));
  };

  const estimate = useMemo(() => computeRedundancyEstimate(pkg), [pkg]);

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          Use best estimates. You can refine these figures later. If you have a confirmed package, use the manual override below.
        </p>
      </div>

      <NumberInput label="Your age" value={pkg.age} onChange={(v) => updatePkg("age", v)} id="age" min={16} max={100} placeholder="35" />
      <NumberInput
        label="Years of continuous service"
        value={pkg.yearsOfService}
        onChange={(v) => updatePkg("yearsOfService", v)}
        id="yearsOfService"
        min={0}
        max={20}
        tooltip="Complete years of continuous employment with this employer. Capped at 20 for statutory calculation. You need at least 2 years to qualify for statutory redundancy pay."
        placeholder="5"
      />

      {!estimate.qualifyingServiceMet && pkg.yearsOfService > 0 && (
        <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Under these assumptions, fewer than 2 years of service means no statutory redundancy entitlement. Notice pay and holiday pay are still included. Last checked: April 2025. Source: GOV.UK.
            </p>
          </div>
        </div>
      )}

      <CurrencyInput
        label="Weekly gross pay"
        value={pkg.weeklyGrossPay}
        onChange={(v) => updatePkg("weeklyGrossPay", v)}
        id="weeklyGrossPay"
        tooltip="Gross weekly pay before deductions. Statutory redundancy is capped at £643/week (April 2025)."
      />
      <NumberInput label="Notice period (weeks)" value={pkg.noticeWeeks} onChange={(v) => updatePkg("noticeWeeks", v)} id="noticeWeeks" min={0} max={52} tooltip="Contractual or statutory notice period in weeks. Notice pay is subject to income tax and National Insurance." />
      <NumberInput label="Accrued untaken holiday (weeks)" value={pkg.holidayWeeks} onChange={(v) => updatePkg("holidayWeeks", v)} id="holidayWeeks" min={0} max={10} tooltip="Untaken holiday to be paid out. Holiday pay is subject to income tax and National Insurance." />
      <CurrencyInput
        label="Unpaid wages (if any)"
        value={inputs.unpaidWages ?? 0}
        onChange={(v) => setInputs({ unpaidWages: v })}
        id="unpaidWages"
        tooltip="Any wages owed but not yet paid. These are subject to income tax and National Insurance."
      />

      <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
        <div>
          <p className="text-sm font-medium">Enhanced package</p>
          <p className="text-xs text-muted-foreground">Were you offered above the statutory minimum?</p>
        </div>
        <Switch
          checked={pkg.enhancedPackage}
          onCheckedChange={(v) => updatePkg("enhancedPackage", v)}
          data-testid="switch-enhancedPackage"
        />
      </div>

      {pkg.enhancedPackage && (
        <CurrencyInput label="Enhanced redundancy amount" value={pkg.enhancedAmount} onChange={(v) => updatePkg("enhancedAmount", v)} id="enhancedAmount" tooltip="Total enhanced redundancy payment (replaces the statutory redundancy element in the estimate)" />
      )}

      <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
        <div>
          <p className="text-sm font-medium">Use actual package amount instead</p>
          <p className="text-xs text-muted-foreground">Override with a known confirmed total</p>
        </div>
        <Switch
          checked={pkg.useManualOverride}
          onCheckedChange={(v) => updatePkg("useManualOverride", v)}
          data-testid="switch-useManualOverride"
        />
      </div>

      {pkg.useManualOverride && (
        <CurrencyInput label="Confirmed package total" value={pkg.manualOverrideAmount} onChange={(v) => updatePkg("manualOverrideAmount", v)} id="manualOverrideAmount" tooltip="The total redundancy package amount you have been offered or received" />
      )}

      {isVoluntaryRedundancy && (
        <CurrencyInput
          label="Voluntary redundancy offer amount"
          value={inputs.voluntaryRedundancyAmount ?? 0}
          onChange={(v) => setInputs({ voluntaryRedundancyAmount: v })}
          id="voluntaryRedundancyAmount"
          tooltip="The VR package being offered. The full report will compare this against your statutory entitlement under these assumptions."
        />
      )}

      <div className="rounded-md bg-muted/50 p-3 mt-4 space-y-2">
        <p className="text-sm font-medium" data-testid="text-redundancy-total">
          Estimated package under statutory assumptions: {formatGBP(estimate.totalEstimated)}
        </p>
        <p className="text-xs text-muted-foreground" data-testid="text-redundancy-breakdown">
          Statutory redundancy: {formatGBP(estimate.statutoryRedundancy)} | Notice pay: {formatGBP(estimate.noticePay)} | Holiday pay: {formatGBP(estimate.holidayPay)}
        </p>
        <div className="rounded-md bg-amber-500/8 border border-amber-500/15 p-2.5 mt-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Tax treatment note:</span> Statutory redundancy pay up to £30,000 is generally tax-free. Notice pay, holiday pay and unpaid wages are subject to income tax and National Insurance. This tool does not calculate exact personal tax liability — the amounts above are gross figures. Last checked: April 2025. Source: GOV.UK.
          </p>
        </div>
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

function StepIncome({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  const sectors = getAllSectors();
  const sectorData = useMemo(() => getSectorData(inputs.sector), [inputs.sector]);
  const ageBandData = useMemo(() => getAgeBandData(inputs.redundancyPackage.age), [inputs.redundancyPackage.age]);
  const partnerIncome = inputs.includePartnerIncome ? (inputs.partnerMonthlyNetIncome ?? 0) : 0;
  const gapIncome = inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate + partnerIncome;

  const effectiveMedianMonths = useMemo(() => {
    const combined = Math.round((sectorData.medianWeeks + ageBandData.medianWeeks) / 2);
    return Math.max(1, Math.round(weeksToMonths(combined)));
  }, [sectorData, ageBandData]);

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          These figures are used to build your report assumptions. The model does not provide financial, tax, legal or employment advice.
        </p>
      </div>

      <CurrencyInput label="Previous monthly net income" value={inputs.currentMonthlyNetIncome} onChange={(v) => setInputs({ currentMonthlyNetIncome: v })} tooltip="Your previous take-home pay per month (used for scenario modelling)" id="currentMonthlyNetIncome" />
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">How long you estimate until your previous income level resumes. Used as a planning assumption for the model — not a prediction.</TooltipContent>
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
        <p className="text-xs text-muted-foreground">After this period, the model assumes your previous income level resumes</p>
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
              Applies the median timeline for your sector and age group to your planning assumptions.
            </TooltipContent>
          </Tooltip>
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

function StepEssential({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void }) {
  const total = inputs.mortgageOrRent + inputs.utilities + inputs.food + inputs.councilTax + inputs.insurance + inputs.transport + inputs.debtRepayments + inputs.childcare + inputs.otherEssential;
  const housingPercent = total > 0 ? ((inputs.mortgageOrRent / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">Enter monthly amounts for fixed costs that continue regardless of employment status. Use best estimates.</p>
      </div>
      <CurrencyInput label="Mortgage or rent" value={inputs.mortgageOrRent} onChange={(v) => setInputs({ mortgageOrRent: v })} id="mortgageOrRent" />
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">Minimum capital you want to keep as a buffer. The model will flag when capital approaches this level.</TooltipContent>
          </Tooltip>
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

function StepReview({ inputs }: { inputs: RunwayInputs }) {
  const pkg = inputs.redundancyPackage;
  const estimate = useMemo(() => computeRedundancyEstimate(pkg), [pkg]);
  const redundancyTotal = pkg.useManualOverride && pkg.manualOverrideAmount > 0 ? pkg.manualOverrideAmount : estimate.totalEstimated;
  const partnerIncome = inputs.includePartnerIncome ? (inputs.partnerMonthlyNetIncome ?? 0) : 0;
  const gapIncome = inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate + partnerIncome;
  const essentialTotal = inputs.mortgageOrRent + inputs.utilities + inputs.food + inputs.councilTax + inputs.insurance + inputs.transport + inputs.debtRepayments + inputs.childcare + inputs.otherEssential;
  const flexTotal = inputs.subscriptions + inputs.leisure + inputs.travel + inputs.discretionaryOther + (inputs.retrainingMonthlyCost ?? 0);
  const startingCapital = inputs.cashSavings + inputs.liquidInvestments + redundancyTotal + inputs.otherOneOffIncome + (inputs.unpaidWages ?? 0);

  const summaryRows = [
    { label: "Starting capital", value: formatGBP(startingCapital) },
    { label: "Redundancy package", value: formatGBP(redundancyTotal) },
    { label: "Monthly essential expenses", value: formatGBP(essentialTotal) + "/mo" },
    { label: "Monthly flexible spending", value: formatGBP(flexTotal) + "/mo" },
    { label: "Gap period income", value: formatGBP(gapIncome) + "/mo" },
    { label: "Months until income resumes", value: inputs.monthsUntilNewJob > 0 ? `${inputs.monthsUntilNewJob} months` : "Not set" },
    { label: "Emergency buffer", value: formatGBP(inputs.emergencyBuffer) },
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
          <div key={row.label} className="flex items-center justify-between gap-2 py-2 border-b text-xs last:border-0">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium" data-testid={`review-${row.label.toLowerCase().replace(/\s+/g, "-")}`}>{row.value}</span>
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
  if (step === 1) {
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
    <StepReview key={6} inputs={inputs} />,
  ];

  return (
    <>
      <Helmet>
        <title>Build Your Redundancy Report — RedundancyCalculatorUK</title>
        <meta name="description" content="Enter your redundancy package, savings, income assumptions and monthly costs to build your private financial runway report. UK statutory calculation built in." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://redundancycalculatoruk.com/wizard" />
        <meta property="og:title" content="Build Your Redundancy Report — RedundancyCalculatorUK" />
        <meta property="og:description" content="Enter your redundancy package, savings, income assumptions and monthly costs to build your private financial runway report." />
        <meta property="og:url" content="https://redundancycalculatoruk.com/wizard" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Build Your Redundancy Report — RedundancyCalculatorUK" />
        <meta name="twitter:description" content="Enter your redundancy package, savings, income assumptions and monthly costs to build your private financial runway report." />
      </Helmet>
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
            {step === totalSteps - 1 ? "Build my report" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Use best estimates. Assumptions can be refined later.
        </p>
      </div>
    </div>
    </>
  );
}
