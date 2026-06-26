import { Dumbbell, Film, GraduationCap, Plane, Sparkles } from "lucide-react";
import type { RunwayInputs } from "@shared/schema";

type FlexibleField = keyof Pick<
  RunwayInputs,
  "subscriptions" | "leisure" | "travel" | "discretionaryOther" | "retrainingMonthlyCost"
>;

const CHIPS: {
  field: FlexibleField;
  label: string;
  amount: number;
  icon: typeof Film;
  color: string;
  note: string;
}[] = [
  { field: "subscriptions", label: "Streaming & subs", amount: 45, icon: Sparkles, color: "#8B5CF6", note: "TV, gym, apps" },
  { field: "leisure", label: "Leisure & dining", amount: 150, icon: Film, color: "#EC4899", note: "Eating out, hobbies" },
  { field: "travel", label: "Travel & holidays", amount: 80, icon: Plane, color: "#06B6D4", note: "Trips, fuel extras" },
  { field: "retrainingMonthlyCost", label: "Retraining", amount: 120, icon: GraduationCap, color: "#10B981", note: "Courses, certs" },
  { field: "discretionaryOther", label: "Minimal flexible", amount: 0, icon: Dumbbell, color: "#64748B", note: "Essential-only runway" },
];

interface FlexibleExpenseChipsProps {
  inputs: RunwayInputs;
  onApply: (patch: Partial<RunwayInputs>) => void;
}

export function FlexibleExpenseChips({ inputs, onApply }: FlexibleExpenseChipsProps) {
  return (
    <div className="space-y-3" data-testid="flexible-expense-chips">
      <div className="p-3 rounded-lg border-l-4 border-violet-300 bg-muted/40">
        <p className="text-sm font-medium text-foreground mb-1">Common flexible spending assumptions</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tap to apply a starting figure. Toggle flexible spending off below for an essentials-only runway.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CHIPS.map((chip) => {
          const Icon = chip.icon;
          const current = inputs[chip.field] ?? 0;
          const isMinimal = chip.field === "discretionaryOther" && chip.amount === 0;
          const active = isMinimal
            ? !inputs.includeNonEssential
            : current === chip.amount && inputs.includeNonEssential;
          return (
            <button
              key={chip.field}
              type="button"
              onClick={() => {
                if (isMinimal) {
                  onApply({
                    includeNonEssential: false,
                    subscriptions: 0,
                    leisure: 0,
                    travel: 0,
                    discretionaryOther: 0,
                    retrainingMonthlyCost: 0,
                  });
                  return;
                }
                onApply({
                  includeNonEssential: true,
                  [chip.field]: chip.amount,
                });
              }}
              className={`rounded-lg border p-2.5 text-left transition-all ${
                active
                  ? "border-gold bg-gold/10 ring-1 ring-gold/30"
                  : "border-border bg-muted/40 hover:border-primary/30 hover:bg-muted/60"
              }`}
              data-testid={`chip-flexible-${chip.field}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: chip.color }} />
                <span className="text-[11px] font-semibold text-foreground leading-snug">{chip.label}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {isMinimal ? "£0 flexible — essentials only" : `~£${chip.amount}/mo · ${chip.note}`}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
