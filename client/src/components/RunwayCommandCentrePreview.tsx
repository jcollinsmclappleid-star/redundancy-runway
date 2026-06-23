import { useState } from "react";
import { BarChart2, TrendingDown, Users, Heart } from "lucide-react";
import { useLocation } from "wouter";

const SCENARIOS = [
  {
    id: "baseline",
    label: "Baseline",
    runway: "10.4",
    sub: "at current assumptions",
    color: "hsl(38 72% 58%)",
    annotation: "Income resumes — month 10",
    path: "M0,5 C30,10 65,28 100,48 C130,65 148,80 158,88 C168,93 180,87 200,83 C230,78 265,74 300,71",
  },
  {
    id: "slow",
    label: "Slow recovery",
    runway: "13.2",
    sub: "if new role takes longer",
    color: "hsl(30 78% 58%)",
    annotation: "Income resumes — month 13",
    path: "M0,5 C25,13 60,35 100,58 C130,76 155,90 180,95 C200,92 225,85 260,80 C280,78 295,77 300,76",
  },
  {
    id: "severe",
    label: "Severe case",
    runway: "5.1",
    sub: "under severe assumptions",
    color: "hsl(22 78% 55%)",
    annotation: "Income resumes — month 5",
    path: "M0,5 C15,20 35,50 60,78 C75,90 88,94 105,88 C130,78 165,60 210,46 C255,34 285,28 300,26",
  },
  {
    id: "oneIncome",
    label: "One-income",
    runway: "18.7",
    sub: "one income supporting household",
    color: "hsl(175 50% 52%)",
    annotation: "Income continues — month 19",
    path: "M0,5 C40,7 100,15 160,28 C200,38 240,52 270,66 C285,72 295,77 300,79",
  },
] as const;

const SENSITIVITY = [
  { label: "Months to replacement income", pct: 91 },
  { label: "Housing cost", pct: 73 },
  { label: "Essential monthly costs", pct: 57 },
  { label: "Replacement income level", pct: 43 },
];

const METRICS = [
  { label: "Baseline runway", value: "10.4 months", sub: "at current assumptions" },
  { label: "Scenario range", value: "5.1 – 18.7 mo", sub: "under tested assumptions" },
  { label: "Starting capital", value: "£42,850", sub: "modelled starting point" },
  { label: "Housing pressure", value: "38%", sub: "of monthly outgoings" },
];

const INSIGHT_PILLS = [
  { icon: TrendingDown, text: "Slow recovery adds 2.8 months of exposure", color: "hsl(38 72% 58%)" },
  { icon: Users,        text: "One-income runway extends to 18.7 months", color: "hsl(175 50% 52%)" },
];

export function RunwayCommandCentrePreview() {
  const [active, setActive] = useState(0);
  const [, navigate] = useLocation();
  const s = SCENARIOS[active];

  return (
    <div className="w-full" data-testid="runway-command-centre">

      {/* ── MOBILE compact view (< md) ───────────────────────────── */}
      <div
        className="md:hidden rounded-2xl border overflow-hidden"
        style={{ background: "hsl(215 50% 8%)", borderColor: "hsl(215 30% 16%)" }}
      >
        {/* Mini title bar */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b"
          style={{ borderColor: "hsl(215 30% 13%)", background: "hsl(215 55% 7%)" }}
        >
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-3 h-3" style={{ color: "hsl(38 72% 58%)" }} />
            <span className="text-[10px] font-semibold tracking-wide" style={{ color: "hsl(215 15% 65%)" }}>
              Private Runway Command Centre
            </span>
          </div>
          <div className="flex gap-1 items-center">
            {["hsl(0 55% 48%)", "hsl(38 72% 52%)", "hsl(142 55% 40%)"].map((c, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </div>

        {/* Headline metric */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-[8px] uppercase tracking-widest mb-1" style={{ color: "hsl(215 15% 38%)" }}>
            Baseline runway estimate
          </p>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="font-serif text-4xl font-bold text-white leading-none">{s.runway}</span>
            <span className="text-sm" style={{ color: "hsl(215 15% 45%)" }}>months</span>
          </div>
          <p className="text-[10px]" style={{ color: "hsl(38 72% 58%)" }}>— {s.sub}</p>
        </div>

        {/* Horizontal chip carousel */}
        <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {SCENARIOS.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => setActive(i)}
              className="shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold transition-all duration-200"
              style={
                i === active
                  ? { background: "hsl(38 72% 52%)", color: "hsl(215 50% 8%)" }
                  : { background: "hsl(215 40% 14%)", color: "hsl(215 15% 52%)", border: "1px solid hsl(215 30% 20%)" }
              }
              data-testid={`scenario-tab-mobile-${sc.id}`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Compact SVG chart */}
        <div
          className="relative mx-4 mb-3 rounded-xl overflow-hidden"
          style={{ background: "hsl(215 55% 6%)", border: "1px solid hsl(215 30% 13%)" }}
        >
          <svg viewBox="0 0 300 70" className="w-full" style={{ height: 70 }}>
            <defs>
              <linearGradient id={`mobileArea-${active}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              d={s.path.replace(/(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (_, x, y) => `${x},${(parseFloat(y) * 0.65).toFixed(1)}`)}
              fill={`url(#mobileArea-${active})`}
            />
            <path
              d={s.path.replace(/(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (_, x, y) => `${x},${(parseFloat(y) * 0.65).toFixed(1)}`)}
              fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"
            />
            <line x1="0" y1="56" x2="300" y2="56"
              stroke="hsl(38 72% 52%)" strokeWidth="0.8" strokeDasharray="4 5" opacity="0.4" />
            <text x="3" y="53" fontSize="5" fill="hsl(38 72% 55%)" opacity="0.6">Survival horizon</text>
          </svg>
          <div className="absolute bottom-1.5 right-2">
            <span className="text-[8px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: "hsl(192 50% 18%)", color: "hsl(192 60% 65%)" }}>
              {s.annotation}
            </span>
          </div>
        </div>

        {/* Two insight pills */}
        <div className="px-4 pb-4 flex flex-col gap-2">
          {INSIGHT_PILLS.map((pill, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: "hsl(215 45% 12%)", border: "1px solid hsl(215 28% 18%)" }}>
              <pill.icon className="w-3.5 h-3.5 shrink-0" style={{ color: pill.color }} />
              <p className="text-[10px] leading-snug" style={{ color: "hsl(215 15% 62%)" }}>{pill.text}</p>
            </div>
          ))}
          <p className="text-[8px] text-center pt-1" style={{ color: "hsl(215 15% 22%)" }}>
            Illustrative. Not financial advice.
          </p>
        </div>
      </div>

      {/* ── DESKTOP full dashboard (md+) ──────────────────────────── */}
      <div
        className="hidden md:block rounded-2xl overflow-hidden border shadow-2xl"
        style={{ background: "hsl(215 50% 8%)", borderColor: "hsl(215 30% 16%)" }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{ borderColor: "hsl(215 30% 13%)", background: "hsl(215 55% 7%)" }}
        >
          <div className="flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5" style={{ color: "hsl(38 72% 58%)" }} />
            <span className="text-[11px] font-semibold tracking-wide" style={{ color: "hsl(215 15% 72%)" }}>
              Private Runway Command Centre
            </span>
          </div>
          <div className="flex gap-1.5 items-center">
            {["hsl(0 55% 48%)", "hsl(38 72% 52%)", "hsl(142 55% 40%)"].map((c, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </div>

        {/* 2×2 Metric cards */}
        <div className="grid grid-cols-2 gap-2 p-3 pb-2">
          {METRICS.map((m, i) => (
            <div key={i} className="rounded-xl px-3 py-2.5"
              style={{ background: "hsl(215 45% 12%)", border: "1px solid hsl(215 28% 18%)" }}
              data-testid={`metric-card-${i}`}>
              <p className="text-[8px] uppercase tracking-widest mb-1" style={{ color: "hsl(215 15% 38%)" }}>
                {m.label}
              </p>
              <p className="text-sm font-bold text-white leading-tight">{m.value}</p>
              <p className="text-[8px] mt-0.5" style={{ color: "hsl(215 15% 35%)" }}>{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Scenario tabs */}
        <div className="flex gap-1.5 px-3 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {SCENARIOS.map((sc, i) => (
            <button key={sc.id} onClick={() => setActive(i)}
              className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all duration-200"
              style={
                i === active
                  ? { background: "hsl(38 72% 52%)", color: "hsl(215 50% 8%)" }
                  : { background: "hsl(215 40% 14%)", color: "hsl(215 15% 52%)", border: "1px solid hsl(215 30% 20%)" }
              }
              data-testid={`scenario-tab-${sc.id}`}>
              {sc.label}
            </button>
          ))}
        </div>

        {/* Active runway figure */}
        <div className="px-3 pb-2 flex items-baseline gap-1.5">
          <span className="font-serif text-3xl font-bold text-white leading-none">{s.runway}</span>
          <span className="text-xs" style={{ color: "hsl(215 15% 45%)" }}>months</span>
          <span className="text-[10px] ml-1" style={{ color: "hsl(38 72% 60%)" }}>— {s.sub}</span>
        </div>

        {/* SVG Capital Path Chart */}
        <div className="relative mx-3 mb-2.5 rounded-xl overflow-hidden"
          style={{ background: "hsl(215 55% 6%)", border: "1px solid hsl(215 30% 13%)" }}>
          <svg viewBox="0 0 300 100" className="w-full" style={{ height: 100 }}>
            <defs>
              <linearGradient id={`areaFill-${active}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[25, 50, 75].map((y) => (
              <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="hsl(215 30% 16%)" strokeWidth="0.5" />
            ))}
            {[0, 6, 12, 18].map((m) => (
              <text key={m} x={m === 18 ? 296 : m * 300 / 18} y="98" fontSize="5"
                fill="hsl(215 15% 30%)" textAnchor={m === 18 ? "end" : m === 0 ? "start" : "middle"}>
                {m}m
              </text>
            ))}
            <path key={`area-${active}`} d={`${s.path} L300,100 L0,100 Z`}
              fill={`url(#areaFill-${active})`} />
            <path key={`line-${active}`} d={s.path}
              fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="84" x2="300" y2="84"
              stroke="hsl(38 72% 52%)" strokeWidth="0.8" strokeDasharray="4 5" opacity="0.45" />
            <text x="3" y="81" fontSize="5.5" fill="hsl(38 72% 55%)" opacity="0.6">Survival horizon</text>
          </svg>
          <div className="absolute bottom-1.5 right-2">
            <span className="text-[8px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: "hsl(192 50% 18%)", color: "hsl(192 60% 65%)" }}>
              {s.annotation}
            </span>
          </div>
        </div>

        {/* Sensitivity ranking */}
        <div className="mx-3 mb-2.5 rounded-xl p-3"
          style={{ background: "hsl(215 45% 11%)", border: "1px solid hsl(215 28% 16%)" }}>
          <p className="text-[8px] font-semibold uppercase tracking-widest mb-2.5"
            style={{ color: "hsl(38 72% 58%)" }}>
            What changes the runway most
          </p>
          {SENSITIVITY.map((item, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px]" style={{ color: "hsl(215 15% 55%)" }}>{item.label}</span>
                <span className="text-[9px]" style={{ color: "hsl(215 15% 38%)" }}>{item.pct}%</span>
              </div>
              <div className="h-[3px] rounded-full" style={{ background: "hsl(215 40% 18%)" }}>
                <div className="h-[3px] rounded-full"
                  style={{ width: `${item.pct}%`, background: "hsl(38 72% 52%)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Need a plan CTA */}
        <div className="mx-3 mb-3 rounded-xl p-3 flex items-center gap-3"
          style={{ background: "hsl(192 55% 11%)", border: "1px solid hsl(192 40% 18%)" }}>
          <div className="flex-1">
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: "hsl(215 15% 80%)" }}>
              Need a plan after the numbers?
            </p>
            <p className="text-[9px]" style={{ color: "hsl(192 30% 42%)" }}>
              Start a 7-Day Redundancy Reset
            </p>
          </div>
          <button onClick={() => navigate("/redundancy-reset")}
            className="shrink-0 text-[9px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
            style={{ background: "hsl(38 72% 52%)", color: "hsl(215 50% 8%)" }}
            data-testid="button-dashboard-reset">
            View support
          </button>
        </div>

        {/* Non-advisory footnote */}
        <div className="px-3 pb-3">
          <p className="text-[7.5px] text-center" style={{ color: "hsl(215 15% 22%)" }}>
            Illustrative only. Figures based on user-entered assumptions. Not financial advice.
          </p>
        </div>
      </div>

    </div>
  );
}
