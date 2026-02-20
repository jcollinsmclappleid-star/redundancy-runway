import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, PoundSterling, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWizardStore } from "@/lib/wizardStore";
import { getAllSectors } from "@/lib/sectorData";
import type { RunwayInputs } from "@shared/schema";

const STEPS = [
  { title: "Savings & Capital", description: "Accessible savings and one-off income" },
  { title: "Income Assumptions", description: "Current and expected replacement income" },
  { title: "Essential Expenses", description: "Fixed monthly costs" },
  { title: "Flexible Expenses", description: "Discretionary monthly spending" },
  { title: "Settings", description: "Projection preferences" },
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

function StepCapital({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: Partial<RunwayInputs>) => void }) {
  return (
    <div className="space-y-4">
      <CurrencyInput label="Cash Savings" value={inputs.cashSavings} onChange={(v) => setInputs({ cashSavings: v })} tooltip="Bank accounts, cash ISAs, and accessible savings" id="cashSavings" />
      <CurrencyInput label="Liquid Investments" value={inputs.liquidInvestments} onChange={(v) => setInputs({ liquidInvestments: v })} tooltip="Stocks and shares ISAs, investment accounts you could access" id="liquidInvestments" />
      <CurrencyInput label="Redundancy Payout" value={inputs.redundancyPayout} onChange={(v) => setInputs({ redundancyPayout: v })} tooltip="Expected or received redundancy payment (after tax if applicable)" id="redundancyPayout" />
      <CurrencyInput label="Other One-Off Income" value={inputs.otherOneOffIncome} onChange={(v) => setInputs({ otherOneOffIncome: v })} tooltip="Any other lump sums expected" id="otherOneOffIncome" />
      <div className="rounded-md bg-muted/50 p-3 mt-4">
        <p className="text-xs text-muted-foreground">
          Starting capital: <span className="font-medium text-foreground">
            {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }).format(
              inputs.cashSavings + inputs.liquidInvestments + inputs.redundancyPayout + inputs.otherOneOffIncome
            )}
          </span>
        </p>
      </div>
    </div>
  );
}

function StepIncome({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: Partial<RunwayInputs>) => void }) {
  return (
    <div className="space-y-4">
      <CurrencyInput label="Previous Monthly Net Income" value={inputs.currentMonthlyNetIncome} onChange={(v) => setInputs({ currentMonthlyNetIncome: v })} tooltip="Your previous take-home pay per month" id="currentMonthlyNetIncome" />
      <CurrencyInput label="Replacement Monthly Income" value={inputs.replacementMonthlyIncome} onChange={(v) => setInputs({ replacementMonthlyIncome: v })} tooltip="Any current part-time, freelance, or gig income" id="replacementMonthlyIncome" />
      <CurrencyInput label="Benefit Support Estimate" value={inputs.benefitSupportEstimate} onChange={(v) => setInputs({ benefitSupportEstimate: v })} tooltip="Estimated monthly benefits (enter manually if applicable)" id="benefitSupportEstimate" />
      <div className="space-y-1.5">
        <Label htmlFor="monthsUntilNewJob" className="text-sm">Months Until New Income (estimate)</Label>
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
      </div>
    </div>
  );
}

function StepEssential({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: Partial<RunwayInputs>) => void }) {
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
    </div>
  );
}

function StepFlexible({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: Partial<RunwayInputs>) => void }) {
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
    </div>
  );
}

function StepSettings({ inputs, setInputs }: { inputs: RunwayInputs; setInputs: (u: Partial<RunwayInputs>) => void }) {
  const sectors = getAllSectors();
  return (
    <div className="space-y-4">
      <CurrencyInput label="Emergency Buffer Threshold" value={inputs.emergencyBuffer} onChange={(v) => setInputs({ emergencyBuffer: v })} tooltip="Milestone marker when capital falls below this amount" id="emergencyBuffer" />
      <div className="space-y-1.5">
        <Label htmlFor="sector" className="text-sm">Employment Sector (optional)</Label>
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
        <p className="text-xs text-muted-foreground">Used for historical reemployment timeline context</p>
      </div>
    </div>
  );
}

export default function WizardPage() {
  const [, navigate] = useLocation();
  const { inputs, setInputs, step, setStep } = useWizardStore();

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const canProceed = step === 0
    ? (inputs.cashSavings + inputs.liquidInvestments + inputs.redundancyPayout + inputs.otherOneOffIncome) >= 0
    : true;

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
    <StepCapital key={0} inputs={inputs} setInputs={setInputs} />,
    <StepIncome key={1} inputs={inputs} setInputs={setInputs} />,
    <StepEssential key={2} inputs={inputs} setInputs={setInputs} />,
    <StepFlexible key={3} inputs={inputs} setInputs={setInputs} />,
    <StepSettings key={4} inputs={inputs} setInputs={setInputs} />,
  ];

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">
              Step {step + 1} of {totalSteps}
            </p>
            <Badge variant="outline" className="text-xs">{STEPS[step].title}</Badge>
          </div>
          <Progress value={progress} className="h-1.5" data-testid="progress-bar" />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{STEPS[step].title}</CardTitle>
            <p className="text-sm text-muted-foreground">{STEPS[step].description}</p>
          </CardHeader>
          <CardContent className="pt-4">
            {stepComponents[step]}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4 mt-6">
          <Button variant="outline" onClick={handleBack} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed} data-testid="button-next">
            {step === totalSteps - 1 ? "View Projection" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Use best estimates. You can refine later.
        </p>
      </div>
    </div>
  );
}
