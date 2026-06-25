import { Home, Zap, ShoppingCart, Car, Shield, Users, Receipt } from "lucide-react";
import type { RunwayInputs } from "@shared/schema";

type ExpenseField = keyof Pick<
  RunwayInputs,
  "councilTax" | "utilities" | "food" | "insurance" | "transport" | "debtRepayments" | "childcare"
>;

const CHIPS: { field: ExpenseField; label: string; median: number; icon: typeof Home; color: string }[] = [
  { field: "councilTax", label: "Council tax", median: 165, icon: Receipt, color: "#EC4899" },
  { field: "utilities", label: "Gas & electric", median: 180, icon: Zap, color: "#F59E0B" },
  { field: "food", label: "Food & groceries", median: 320, icon: ShoppingCart, color: "#84CC16" },
  { field: "insurance", label: "Insurance", median: 65, icon: Shield, color: "#8B5CF6" },
  { field: "transport", label: "Transport", median: 220, icon: Car, color: "#06B6D4" },
  { field: "debtRepayments", label: "Debt repayments", median: 150, icon: Home, color: "#F43F5E" },
  { field: "childcare", label: "Childcare", median: 480, icon: Users, color: "#A855F7" },
];

interface EssentialExpenseChipsProps {
  inputs: RunwayInputs;
  onApply: (field: ExpenseField, value: number) => void;
}

export function EssentialExpenseChips({ inputs, onApply }: EssentialExpenseChipsProps) {
  return (
    <div className="space-y-3" data-testid="essential-expense-chips">
      <div className="p-3 rounded-lg border-l-4 border-rose-300 bg-muted/40">
        <p className="text-sm font-medium text-foreground mb-1">Quick-add typical UK costs</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tap a tile to use a typical monthly figure as a starting point — adjust any field below to match your situation.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CHIPS.map((chip) => {
          const Icon = chip.icon;
          const active = (inputs[chip.field] ?? 0) > 0;
          return (
            <button
              key={chip.field}
              type="button"
              onClick={() => onApply(chip.field, active ? inputs[chip.field] : chip.median)}
              className={`rounded-lg border p-2.5 text-left transition-all ${
                active
                  ? "bg-card border-gold/50 shadow-sm"
                  : "bg-muted/40 border-border hover:border-primary/30 hover:bg-muted/60"
              }`}
              data-testid={`chip-essential-${chip.field}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5" style={{ color: chip.color }} />
                <span className="text-[11px] font-semibold text-foreground truncate">{chip.label}</span>
              </div>
              {active ? (
                <span className="text-sm font-bold tabular-nums" style={{ color: chip.color }}>
                  £{inputs[chip.field].toLocaleString("en-GB")}/mo
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground">~£{chip.median}/mo typical</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
