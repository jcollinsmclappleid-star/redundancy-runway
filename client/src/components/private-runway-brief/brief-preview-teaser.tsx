import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { chartTheme } from "@/lib/chart-theme";

const MOCK_METRICS = [
  { label: "Baseline runway", value: "34 mo" },
  { label: "Severe case", value: "18 mo" },
  { label: "Starting capital", value: "£33,200" },
  { label: "Net monthly burn", value: "£1,420" },
];

const MOCK_SCENARIOS = [
  { name: "Baseline", months: 34, pct: 100 },
  { name: "Slow recovery", months: 28, pct: 82 },
  { name: "Zero Income", months: 18, pct: 53 },
];

const MOCK_SENSITIVITY = [
  { label: "Job gap +6 months", diff: -8 },
  { label: "Essentials +10%", diff: -4 },
  { label: "Housing +2%", diff: -2 },
];

function MockMiniChart() {
  const points = [100, 92, 84, 76, 68, 60, 52, 44, 36, 28, 20, 12];
  return (
    <div className="h-16 flex items-end gap-0.5 px-1">
      {points.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm opacity-70"
          style={{ height: `${h}%`, background: i < 6 ? chartTheme.color.s1 : chartTheme.color.pressure }}
        />
      ))}
    </div>
  );
}

export function BriefPreviewTeaser() {
  const [, navigate] = useLocation();

  return (
    <Card
      className="border-2 border-gold/30 overflow-hidden bg-gradient-to-br from-primary to-[hsl(220_52%_15%)]"
      data-testid="card-brief-preview-teaser"
    >
      <CardContent className="p-0">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-semibold text-white">Private Runway Brief</h3>
            <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full">Included with £39 report</span>
          </div>
          <p className="text-xs text-white/60">
            Your Command Centre shows the model. Your Private Runway Brief explains the figures in plain English.
          </p>
        </div>
        <div className="relative bg-white">
          <div className="p-4 blur-[3px] select-none pointer-events-none space-y-4" aria-hidden>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_METRICS.map((m) => (
                <div key={m.label} className="rounded-lg border border-gold/20 p-3 bg-[hsl(40_30%_98%)]">
                  <p className="text-[9px] uppercase text-muted-foreground">{m.label}</p>
                  <p className="text-sm font-bold text-primary">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-[9px] uppercase text-muted-foreground mb-2">Runway path</p>
              <MockMiniChart />
            </div>
            <div className="space-y-2">
              {MOCK_SCENARIOS.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="text-[10px] w-20 truncate text-muted-foreground">{s.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-primary/60" style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="text-[10px] tabular-nums text-primary">{s.months}mo</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {MOCK_SENSITIVITY.map((s) => (
                <div key={s.label} className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground truncate">{s.label}</span>
                  <span className="text-red-600 font-medium tabular-nums">{s.diff} mo</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-gold/15 p-3 bg-[hsl(40_30%_98%)]">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Under the assumptions entered, your baseline runway is supported by starting capital and gap-period income…
              </p>
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-sm p-6">
            <Lock className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-center text-foreground max-w-xs">
              Unlock to generate your dashboard-backed Private Runway Brief
            </p>
            <Button
              size="sm"
              className="btn-gold"
              onClick={() => navigate("/unlock")}
              data-testid="button-unlock-brief-preview"
            >
              Unlock Private Runway Report — £39
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
