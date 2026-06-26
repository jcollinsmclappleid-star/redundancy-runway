import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PoundSterling } from "lucide-react";
import { FieldHelp } from "@/components/ui/field-help";
import { formatGBP } from "@/lib/engine";
import { monthlyFromWeeklyGross, weeklyFromMonthlyGross } from "@/lib/gross-pay";

type PayPeriod = "weekly" | "monthly";

interface GrossPayInputProps {
  weeklyGrossPay: number;
  onWeeklyChange: (weekly: number) => void;
  weeklyCapHint?: string;
  id?: string;
}

export function GrossPayInput({
  weeklyGrossPay,
  onWeeklyChange,
  weeklyCapHint,
  id = "weeklyGrossPay",
}: GrossPayInputProps) {
  const [period, setPeriod] = useState<PayPeriod>("weekly");
  const displayValue = period === "weekly" ? weeklyGrossPay : monthlyFromWeeklyGross(weeklyGrossPay);
  const equivalent =
    weeklyGrossPay > 0
      ? period === "weekly"
        ? `≈ ${formatGBP(monthlyFromWeeklyGross(weeklyGrossPay))}/month`
        : `≈ ${formatGBP(weeklyGrossPay)}/week`
      : null;

  const handleChange = (raw: number) => {
    const weekly = period === "weekly" ? raw : weeklyFromMonthlyGross(raw);
    onWeeklyChange(Math.max(0, weekly));
  };

  return (
    <div className="space-y-2" data-testid="gross-pay-input">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Label htmlFor={id} className="text-sm">
            Gross pay ({period === "weekly" ? "per week" : "per month"})
          </Label>
          <FieldHelp
            text={
              weeklyCapHint ??
              "Enter gross pay before tax and NI. The model stores a weekly figure for statutory redundancy rules."
            }
          />
        </div>
        <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40">
          {(["weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold capitalize transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`pay-period-${p}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          id={id}
          type="number"
          min={0}
          step="1"
          value={displayValue || ""}
          onChange={(e) => handleChange(Math.max(0, Number(e.target.value) || 0))}
          className="pl-8"
          placeholder="0"
          data-testid={`input-${id}`}
        />
      </div>
      {equivalent && (
        <p className="text-[11px] text-muted-foreground" data-testid="gross-pay-equivalent">
          {equivalent} used in calculations
        </p>
      )}
    </div>
  );
}
