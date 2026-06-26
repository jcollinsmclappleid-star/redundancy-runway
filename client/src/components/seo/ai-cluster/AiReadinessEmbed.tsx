import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computeRunway, formatGBP, formatMonths } from "@/lib/engine";
import type { RunwayInputs } from "@shared/schema";
import { AI_CTA_PRESETS } from "@shared/aiRedundancySeo";

function NumberField({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1"
      />
    </div>
  );
}

const defaultInputs: RunwayInputs = {
  context: {
    employmentStatus: "ai_automation_concern",
    housingType: "mortgage",
    householdStructure: "single",
    hasDependents: false,
    confidenceLevel: "uncertain",
  },
  redundancyPackage: {
    age: 42,
    yearsOfService: 8,
    weeklyGrossPay: 650,
    noticeWeeks: 0,
    holidayWeeks: 0,
    enhancedPackage: false,
    enhancedAmount: 0,
    useManualOverride: true,
    manualOverrideAmount: 18000,
  },
  cashSavings: 12000,
  liquidInvestments: 0,
  otherOneOffIncome: 0,
  unpaidWages: 0,
  voluntaryRedundancyAmount: 0,
  currentMonthlyNetIncome: 2800,
  replacementMonthlyIncome: 0,
  monthsUntilNewJob: 6,
  benefitSupportEstimate: 0,
  partnerMonthlyNetIncome: 0,
  includePartnerIncome: false,
  mortgageOrRent: 950,
  utilities: 180,
  food: 400,
  councilTax: 150,
  insurance: 80,
  transport: 120,
  debtRepayments: 200,
  childcare: 0,
  otherEssential: 100,
  subscriptions: 40,
  leisure: 80,
  travel: 0,
  discretionaryOther: 80,
  retrainingMonthlyCost: 0,
  includeNonEssential: true,
  emergencyBuffer: 5000,
  sector: "all",
  mortgageSensitivityPercent: 0,
};

export function AiReadinessEmbed() {
  const [inputs, setInputs] = useState<RunwayInputs>(defaultInputs);
  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const startingCapital =
    inputs.redundancyPackage.manualOverrideAmount +
    inputs.cashSavings +
    inputs.liquidInvestments +
    inputs.otherOneOffIncome;

  const update = <K extends keyof RunwayInputs>(key: K, value: RunwayInputs[K]) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="px-6 py-8 bg-muted/25 border-y" data-testid="ai-readiness-embed">
      <div className="max-w-5xl mx-auto">
        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-foreground">AI redundancy readiness model</p>
                <p className="text-xs text-muted-foreground">
                  Adjust assumptions to see runway months if work changes. Does not predict job loss.
                </p>
              </div>
              <Badge variant="outline" className="w-fit">
                Illustrative scenario
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <NumberField
                id="ai-embed-package"
                label="Package assumption"
                value={inputs.redundancyPackage.manualOverrideAmount}
                min={0}
                step={500}
                onChange={(value) =>
                  setInputs((current) => ({
                    ...current,
                    redundancyPackage: { ...current.redundancyPackage, manualOverrideAmount: value, useManualOverride: true },
                  }))
                }
              />
              <NumberField
                id="ai-embed-savings"
                label="Cash savings"
                value={inputs.cashSavings}
                min={0}
                step={500}
                onChange={(value) => update("cashSavings", value)}
              />
              <NumberField
                id="ai-embed-housing"
                label="Mortgage or rent"
                value={inputs.mortgageOrRent}
                min={0}
                step={50}
                onChange={(value) => update("mortgageOrRent", value)}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-md bg-primary text-primary-foreground p-4 sm:col-span-1">
                <p className="text-xs opacity-75 mb-1">Estimated runway</p>
                <p className="text-2xl font-bold tabular-nums">{formatMonths(result.monthsUntilDepletion)}</p>
              </div>
              <div className="rounded-md bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground mb-1">Starting capital</p>
                <p className="text-lg font-semibold tabular-nums">{formatGBP(startingCapital)}</p>
              </div>
              <div className="rounded-md bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground mb-1">Monthly burn</p>
                <p className="text-lg font-semibold tabular-nums">{formatGBP(result.monthlyBurn)}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground max-w-md">
                Scenario modelling only — not financial, employment or legal advice.
              </p>
              <Link href={AI_CTA_PRESETS.readiness.primary.href}>
                <Button className="btn-gold w-full sm:w-auto" data-testid="ai-embed-wizard-cta">
                  {AI_CTA_PRESETS.readiness.primary.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
