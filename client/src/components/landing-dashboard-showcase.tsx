import { useState } from "react";
import { Columns3, Sparkles } from "lucide-react";
import { RunwayConsole, DEMO_CONSOLE_SCENARIOS, DEMO_COMPOSITION } from "@/components/runway-console";
import { ScenarioLeaderboard } from "@/components/scenario-leaderboard";
import { chartTheme } from "@/lib/chart-theme";
import type { ScenarioComparison } from "@shared/schema";

const DEMO_LEADERBOARD: ScenarioComparison[] = [
  {
    name: "Baseline",
    description: "Current burn rate with replacement income assumptions entered",
    result: {
      monthsUntilDepletion: 10.4,
      monthlyBurn: 2840,
      startingCapital: 42850,
      stabilityScore: 58,
      stabilityBand: "Watch",
      projections: Array.from({ length: 61 }, (_, m) => ({ month: m, capital: Math.max(0, 42850 - m * 820), income: 0, expenses: 2840 })),
    } as ScenarioComparison["result"],
  },
  {
    name: "Slow recovery",
    description: "If a new role takes longer than expected under these assumptions",
    result: {
      monthsUntilDepletion: 13.2,
      monthlyBurn: 2840,
      startingCapital: 42850,
      stabilityScore: 48,
      stabilityBand: "Watch",
      projections: Array.from({ length: 61 }, (_, m) => ({ month: m, capital: Math.max(0, 42850 - m * 650), income: 0, expenses: 2840 })),
    } as ScenarioComparison["result"],
  },
  {
    name: "Zero income",
    description: "No replacement income for the full projection period",
    result: {
      monthsUntilDepletion: 5.1,
      monthlyBurn: 3120,
      startingCapital: 42850,
      stabilityScore: 28,
      stabilityBand: "High Pressure",
      projections: Array.from({ length: 61 }, (_, m) => ({ month: m, capital: Math.max(0, 42850 - m * 1400), income: 0, expenses: 3120 })),
    } as ScenarioComparison["result"],
  },
  {
    name: "One-income household",
    description: "Household temporarily supported by one income only",
    result: {
      monthsUntilDepletion: 18.7,
      monthlyBurn: 1980,
      startingCapital: 42850,
      stabilityScore: 72,
      stabilityBand: "Stable",
      projections: Array.from({ length: 61 }, (_, m) => ({ month: m, capital: Math.max(0, 42850 - m * 480), income: 0, expenses: 1980 })),
    } as ScenarioComparison["result"],
  },
];

type View = "preview" | "scenarios";

export function LandingDashboardShowcase() {
  const [view, setView] = useState<View>("preview");

  const tabs: { id: View; label: string; icon: typeof Sparkles }[] = [
    { id: "preview", label: "Free preview", icon: Sparkles },
    { id: "scenarios", label: "Side by side", icon: Columns3 },
  ];

  return (
    <div className="w-full" data-testid="landing-dashboard-showcase">
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setView(t.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              view === t.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
            data-testid={`showcase-tab-${t.id}`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        {view === "preview" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-primary via-[hsl(220_52%_22%)] to-[hsl(220_52%_16%)] text-white px-6 py-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
                  Analysis complete
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gold/15 text-gold border border-gold/30 px-3 py-1 rounded-full">
                  Free preview
                </span>
              </div>
              <h3 className="font-display text-xl font-bold mb-1">Your baseline runway is ready</h3>
              <p className="text-white/65 text-sm max-w-lg mb-4">
                This is what you get after entering your assumptions — baseline runway, capital composition, resilience scoring, and an interactive command console.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Runway", value: "10.4 mo", stripe: chartTheme.color.s1 },
                  { label: "Starting capital", value: "£42,850", stripe: chartTheme.color.cash },
                  { label: "Monthly burn", value: "£2,840", stripe: chartTheme.color.attention },
                  { label: "RRI score", value: "58/100", stripe: chartTheme.color.s2 },
                ].map((m) => (
                  <div key={m.label} className="bg-white rounded-xl border border-slate-200 border-t-4 overflow-hidden" style={{ borderTopColor: m.stripe }}>
                    <div className="px-3 py-2.5 text-center">
                      <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-0.5">{m.label}</p>
                      <p className="text-sm font-bold text-[#1a3357] tabular-nums">{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <RunwayConsole
                scenarios={DEMO_CONSOLE_SCENARIOS}
                composition={DEMO_COMPOSITION}
                chromeCaption="Runway Command Console"
                footerText="Illustrative example · your report uses the figures you enter"
                hideStress={false}
                testId="landing-demo-preview-console"
              />
            </div>
          </div>
        )}

        {view === "scenarios" && (
          <ScenarioLeaderboard
            scenarios={DEMO_LEADERBOARD}
            title="Income recovery paths"
            testId="landing-demo-leaderboard"
          />
        )}
      </div>

      <p className="text-[10px] text-center text-muted-foreground mt-6">
        Illustrative example dashboards. Build your report to see your own figures.
      </p>
    </div>
  );
}
