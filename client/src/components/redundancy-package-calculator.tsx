import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PoundSterling, Info, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatGBP, computeRedundancyEstimate, UK_STATUTORY_REDUNDANCY } from "@/lib/engine";
import type { RunwayInputs } from "@shared/schema";

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

interface RedundancyPackageCalculatorProps {
  inputs: RunwayInputs;
  setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void;
  /** Compact mode hides intro copy for SEO embeds */
  compact?: boolean;
}

export function RedundancyPackageCalculator({ inputs, setInputs, compact = false }: RedundancyPackageCalculatorProps) {
  const pkg = inputs.redundancyPackage;
  const isVoluntaryRedundancy = inputs.context.employmentStatus === "voluntary_redundancy";

  const updatePkg = (field: string, value: number | boolean) => {
    setInputs((prev) => ({ ...prev, redundancyPackage: { ...prev.redundancyPackage, [field]: value } }));
  };

  const estimate = useMemo(() => computeRedundancyEstimate(pkg), [pkg]);
  const hasPackageDetails = pkg.noticeWeeks > 0 || pkg.holidayWeeks > 0 || pkg.enhancedPackage || pkg.useManualOverride;

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            Use best estimates. You can refine these figures later. If you have a confirmed package, use the manual override below.
          </p>
        </div>
      )}

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
              Under these assumptions, fewer than {UK_STATUTORY_REDUNDANCY.minServiceYears} years of service means no statutory redundancy entitlement. Notice pay and holiday pay are still included. Last checked: {UK_STATUTORY_REDUNDANCY.lastChecked}. Source: GOV.UK.
            </p>
          </div>
        </div>
      )}

      <CurrencyInput
        label="Weekly gross pay"
        value={pkg.weeklyGrossPay}
        onChange={(v) => updatePkg("weeklyGrossPay", v)}
        id="weeklyGrossPay"
        tooltip={`Gross weekly pay before deductions. Statutory redundancy is capped at ${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)}/week for redundancies on or after ${UK_STATUTORY_REDUNDANCY.effectiveFrom}.`}
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

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mt-4 space-y-3" data-testid="panel-redundancy-summary">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Your estimated statutory redundancy pay</p>
          <p className="text-2xl font-bold text-primary tabular-nums" data-testid="text-statutory-reveal">
            {estimate.qualifyingServiceMet ? formatGBP(estimate.statutoryRedundancy) : formatGBP(0)}
          </p>
        </div>
        <p className="text-sm font-semibold text-foreground" data-testid="text-redundancy-total">
          Estimated package total: {formatGBP(estimate.totalEstimated)}
        </p>
        <p className="text-xs text-muted-foreground" data-testid="text-redundancy-breakdown">
          Notice pay: {formatGBP(estimate.noticePay)} · Holiday pay: {formatGBP(estimate.holidayPay)}
        </p>
        {!hasPackageDetails && pkg.weeklyGrossPay > 0 && (
          <p className="text-xs text-primary font-medium">
            Add notice, holiday or enhanced package details to build the full picture — or continue to see how long it could last.
          </p>
        )}
        <div className="rounded-md bg-amber-500/8 border border-amber-500/15 p-2.5">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Tax treatment note:</span> Statutory redundancy pay up to {formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold)} is generally tax-free. Notice pay, holiday pay and unpaid wages are subject to income tax and National Insurance. This tool does not calculate exact personal tax liability — the amounts above are gross figures. Last checked: {UK_STATUTORY_REDUNDANCY.lastChecked}. Source: GOV.UK.
          </p>
        </div>
      </div>
    </div>
  );
}
