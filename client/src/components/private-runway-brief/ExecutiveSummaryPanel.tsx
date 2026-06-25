import { Card, CardContent } from "@/components/ui/card";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import type { BriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import { buildExecutiveSummaryFacts } from "@/lib/private-runway-brief/buildExecutiveSummaryFacts";

const THEME_LABELS: Record<string, string> = {
  starting_capital: "Starting capital",
  housing_pressure: "Housing pressure",
  scenario_spread: "Scenario spread",
  monthly_pressure: "Monthly pressure",
  data_quality: "Data quality",
  runway_duration: "Runway duration",
  sensitivity: "Sensitivity",
  income_assumptions: "Income assumptions",
};

function getExecutiveSummary(narrative: PrivateRunwayBriefNarrative) {
  if (narrative.executiveSummary) return narrative.executiveSummary;
  if (narrative.overview) {
    return {
      headline: narrative.overview.headline,
      narrativeSummary: narrative.overview.summary,
      qualitativeFindings: [],
      methodologyInContext: "",
    };
  }
  return {
    headline: "",
    narrativeSummary: "",
    qualitativeFindings: [],
    methodologyInContext: "",
  };
}

interface ExecutiveSummaryPanelProps {
  narrative: PrivateRunwayBriefNarrative;
  dashboard: BriefDashboardData;
}

export function ExecutiveSummaryPanel({ narrative, dashboard }: ExecutiveSummaryPanelProps) {
  const exec = getExecutiveSummary(narrative);
  const facts = buildExecutiveSummaryFacts(dashboard);
  const findingMap = new Map(exec.qualitativeFindings.map((f) => [f.themeKey, f.observation]));

  const defaultThemes = [
    "starting_capital",
    "monthly_pressure",
    "scenario_spread",
    "housing_pressure",
    "data_quality",
  ];

  return (
    <section className="break-inside-avoid" data-testid="brief-section-executive-summary">
      <Card className="border border-gold/25 bg-white shadow-md rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-[hsl(220_52%_28%)] px-5 py-4">
          <p className="text-[10px] uppercase tracking-widest text-gold/90 font-medium mb-1">Executive summary</p>
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-white leading-snug">{exec.headline}</h2>
        </div>
        <CardContent className="p-5 sm:p-6 space-y-6">
          <p className="text-sm text-foreground/85 leading-relaxed">{exec.narrativeSummary}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-gold font-semibold">Qualitative findings</p>
              <div className="space-y-2">
                {(exec.qualitativeFindings.length > 0 ? exec.qualitativeFindings : defaultThemes.map((k) => ({ themeKey: k, observation: "" }))).map(
                  (f) => {
                    const observation = f.observation || findingMap.get(f.themeKey);
                    if (!observation) return null;
                    return (
                      <div
                        key={f.themeKey}
                        className="rounded-lg border border-gold/10 bg-[hsl(40_30%_98%)] p-3"
                      >
                        <p className="text-xs font-semibold text-primary mb-1">
                          {THEME_LABELS[f.themeKey] ?? f.themeKey.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{observation}</p>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-gold font-semibold">
                How your figures were used
              </p>
              <div className="space-y-2">
                {[facts.modelCalculated, facts.startingCapitalLogic, facts.monthlyPressureLogic, ...facts.scenarioDefinitions].map(
                  (fact) => (
                    <div key={fact.factKey} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                      <p className="text-xs font-semibold text-[#1a3357] mb-1">{fact.title}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{fact.body}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {exec.methodologyInContext && (
            <div className="rounded-lg border border-primary/15 bg-primary/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-2">
                Methodology in context
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">{exec.methodologyInContext}</p>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground leading-relaxed border-t border-gold/15 pt-4">
            {facts.methodologyNote}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
