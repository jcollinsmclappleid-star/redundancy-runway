import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface DashboardPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  testId?: string;
  footer?: ReactNode;
}

export function DashboardPanel({ title, subtitle, children, testId, footer }: DashboardPanelProps) {
  return (
    <div
      className="rounded-2xl bg-white dark:bg-white border border-slate-200 shadow-sm shadow-slate-900/5 overflow-hidden"
      data-testid={testId}
    >
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <Sparkles className="w-3 h-3 text-gold/70" />
          <span>{title}</span>
        </div>
        <div className="w-12" />
      </div>
      {(subtitle || footer) && (
        <div className="px-4 py-3 border-b border-slate-100 bg-white">
          {subtitle && <p className="text-xs text-slate-500 leading-relaxed">{subtitle}</p>}
        </div>
      )}
      <div className="p-4 sm:p-5 bg-white">{children}</div>
      {footer && (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
}

interface MetricStripeItem {
  label: string;
  value: ReactNode;
  stripe: string;
  testId?: string;
}

export function MetricStripe({ items }: { items: MetricStripeItem[] }) {
  return (
    <div className={`grid gap-3 mb-5 ${items.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : items.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {items.map((m) => (
        <div
          key={m.label}
          className="bg-white rounded-xl border border-slate-200 border-t-4 shadow-sm px-4 py-3"
          style={{ borderTopColor: m.stripe }}
          data-testid={m.testId}
        >
          <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-1">{m.label}</p>
          <div className="text-lg sm:text-xl font-bold text-[#1a3357] tabular-nums font-display">{m.value}</div>
        </div>
      ))}
    </div>
  );
}
