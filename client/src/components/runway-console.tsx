import { useState, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Lock, Sparkles, ChevronRight, Eye, TrendingDown } from "lucide-react";
import { AnimatedNumber } from "@/components/charts/animated-number";
import { CapitalCompositionBar, CapitalCompositionLegend } from "@/components/capital-composition-bar";
import { RriGauge } from "@/components/rri-gauge";
import { chartTheme, fmtK, fmtGbp, gaugeColor, densifyProjection, hashSeed } from "@/lib/chart-theme";
import { formatMonths } from "@/lib/engine";
import type { ScenarioComparison, SensitivityResult } from "@shared/schema";

export interface RunwayConsoleScenario {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  tagTone: "balanced" | "sustain" | "stretch" | "complex";
  runwayMonths: number;
  monthlyBurn: number;
  startingCapital: number;
  resilienceScore: number;
  projection: number[];
  depletionMonth?: number;
}

export interface RunwayConsoleProps {
  scenarios: RunwayConsoleScenario[];
  composition: { label: string; value: number; color: string }[];
  locked?: boolean;
  onUnlock?: () => void;
  chromeCaption?: string;
  footerText?: string;
  hideStress?: boolean;
  unlockLabel?: string;
  testId?: string;
  defaultActiveIndex?: number;
}

const TONE_CLS: Record<RunwayConsoleScenario["tagTone"], string> = {
  balanced: "bg-cyan-400/15 text-cyan-700 border-cyan-400/30",
  sustain: "bg-emerald-400/15 text-emerald-700 border-emerald-400/30",
  stretch: "bg-amber-400/15 text-amber-700 border-amber-400/30",
  complex: "bg-violet-400/15 text-violet-700 border-violet-400/30",
};

type StressKey = "income" | "essentials" | "mortgage";
const STRESS_LABELS: Record<StressKey, string> = {
  income: "Income delayed +3mo",
  essentials: "Essentials +10%",
  mortgage: "Mortgage rate +1%",
};

function applyStress(s: RunwayConsoleScenario, k: StressKey, on: boolean): RunwayConsoleScenario {
  if (!on) return s;
  if (k === "income")
    return { ...s, runwayMonths: Math.max(1, s.runwayMonths - 2.5), resilienceScore: Math.max(0, s.resilienceScore - 10) };
  if (k === "essentials")
    return { ...s, monthlyBurn: Math.round(s.monthlyBurn * 1.1), runwayMonths: Math.max(1, s.runwayMonths - 1.8), resilienceScore: Math.max(0, s.resilienceScore - 8) };
  return { ...s, monthlyBurn: Math.round(s.monthlyBurn * 1.04), runwayMonths: Math.max(1, s.runwayMonths - 1.2), resilienceScore: Math.max(0, s.resilienceScore - 6) };
}

export function RunwayConsole({
  scenarios,
  composition,
  locked = false,
  onUnlock,
  chromeCaption = "Runway Command Console",
  footerText,
  hideStress = false,
  unlockLabel = "Open full runway report",
  testId = "runway-console",
  defaultActiveIndex = 0,
}: RunwayConsoleProps) {
  const [active, setActive] = useState(defaultActiveIndex);
  const [stress, setStress] = useState<Record<StressKey, boolean>>({ income: false, essentials: false, mortgage: false });
  const stressKey = `${stress.income ? 1 : 0}-${stress.essentials ? 1 : 0}-${stress.mortgage ? 1 : 0}`;

  const safeScenarios = scenarios.length > 0 ? scenarios : [];
  const base = safeScenarios[Math.min(active, Math.max(0, safeScenarios.length - 1))];
  const sc = useMemo(() => {
    if (!base) return null;
    let next = base;
    (Object.keys(stress) as StressKey[]).forEach((k) => { next = applyStress(next, k, stress[k]); });
    return next;
  }, [base, stress]);

  if (!base || !sc) return null;

  const compTotal = composition.reduce((s, c) => s + c.value, 0) || 1;
  const rriColor = gaugeColor(sc.resilienceScore);
  const endingCapital = sc.projection[sc.projection.length - 1] ?? 0;

  return (
    <div className="relative w-full max-w-[700px] mx-auto" data-testid={testId}>
      <div className="relative rounded-2xl bg-white dark:bg-white border border-slate-200 shadow-lg shadow-slate-900/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            {locked ? <Eye className="w-3 h-3 text-gold/70" /> : <Sparkles className="w-3 h-3 text-gold/70" />}
            <span>{chromeCaption}{locked ? " — preview" : ""}</span>
          </div>
          <div className="w-12" />
        </div>

        <div className="px-4 pt-4 pb-3 border-b border-slate-100">
          <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400 font-medium mb-2">Switch income recovery path</p>
          <div className="flex gap-1.5 flex-wrap">
            {safeScenarios.map((s, i) => {
              const isActive = i === Math.min(active, safeScenarios.length - 1);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  data-testid={`chip-scenario-${s.id}`}
                  aria-pressed={isActive}
                  className={`relative px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border ${
                    isActive
                      ? "bg-gold text-[#0B1220] border-gold"
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {s.shortName}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${stressKey}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: chartTheme.ease }}
          >
            <div className="grid grid-cols-3 gap-px bg-slate-100 relative">
              <Metric
                label="Estimated runway"
                locked={locked}
                value={
                  <AnimatedNumber
                    value={sc.runwayMonths}
                    format={(v) => `${v >= 60 ? "60+" : v.toFixed(1)}`}
                    className="text-2xl font-bold text-[#1a3357] tabular-nums"
                    testId="metric-runway"
                  />
                }
                sub={`${formatMonths(sc.runwayMonths)} under this path`}
              />
              <Metric
                label="Net monthly burn"
                locked={locked}
                value={
                  <AnimatedNumber
                    value={sc.monthlyBurn}
                    format={(v) => fmtGbp(v)}
                    className="text-2xl font-bold text-[#1a3357] tabular-nums"
                    testId="metric-burn"
                  />
                }
                sub={`Starting capital ${fmtK(sc.startingCapital)}`}
                accent="down"
              />
              <Metric
                label="Runway Resilience (RRI)"
                locked={locked}
                value={
                  <span className="flex items-baseline gap-1" style={{ color: rriColor.stroke }}>
                    <AnimatedNumber
                      value={sc.resilienceScore}
                      format={(v) => `${Math.round(v)}`}
                      className="text-2xl font-bold tabular-nums"
                      testId="metric-rri"
                    />
                    <span className="text-sm font-medium text-slate-400">/ 100</span>
                  </span>
                }
                sub={rriColor.label}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-px bg-slate-100">
              <div className="bg-white p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Starting capital composition</p>
                    <p className="text-[10px] font-mono text-slate-400">{fmtGbp(compTotal)}</p>
                  </div>
                  <CapitalCompositionBar segments={composition} locked={locked} />
                  <CapitalCompositionLegend segments={composition} locked={locked} maxItems={4} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">5-year capital trajectory</p>
                    <p className="text-[10px] font-mono text-slate-500">
                      Yr 5{" "}
                      <span className={`font-semibold ${endingCapital > 0 ? "text-emerald-600" : "text-rose-600"} ${locked ? "blur-[4px] select-none" : ""}`}>
                        {fmtK(endingCapital)}
                      </span>
                    </p>
                  </div>
                  <Sparkline
                    data={densifyProjection(sc.projection, hashSeed(sc.id))}
                    depletionMonth={sc.depletionMonth}
                    locked={locked}
                  />
                </div>
              </div>

              <div className="bg-white p-4 flex flex-col">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-2">Runway Resilience Indicator</p>
                <div className="flex-1 flex items-center justify-center">
                  <div className="bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                    <RriGauge score={sc.resilienceScore} size={150} label={rriColor.label.toUpperCase()} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-2 py-1.5 text-center">
                    <p className="text-[9px] text-slate-400">Path</p>
                    <p className="text-[10px] font-semibold text-[#1a3357] truncate">{sc.shortName}</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-2 py-1.5 text-center">
                    <p className="text-[9px] text-slate-400">Ending capital</p>
                    <p className={`text-base font-bold tabular-nums ${locked ? "blur-[5px] select-none" : ""}`} style={{ color: rriColor.stroke }}>
                      {fmtK(endingCapital)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!hideStress && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2 mb-2">
                  <Sliders className="w-3 h-3 text-gold/70" />
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Stress test the assumptions</p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {(Object.keys(STRESS_LABELS) as StressKey[]).map((k) => {
                    const on = stress[k];
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setStress((s) => ({ ...s, [k]: !s[k] }))}
                        data-testid={`stress-${k}`}
                        aria-pressed={on}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all border ${
                          on
                            ? "bg-rose-500/20 text-rose-700 border-rose-400/40"
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {on && <span className="mr-1">●</span>}
                        {STRESS_LABELS[k]}
                      </button>
                    );
                  })}
                  {(stress.income || stress.essentials || stress.mortgage) && (
                    <button
                      type="button"
                      onClick={() => setStress({ income: false, essentials: false, mortgage: false })}
                      className="px-2 py-1 rounded-md text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {locked && onUnlock && (
          <button
            type="button"
            onClick={onUnlock}
            className="absolute left-1/2 -translate-x-1/2 top-[42%] z-20 group"
            data-testid="button-console-unlock"
          >
            <span className="flex items-center gap-2 bg-white border border-gold/50 shadow-md rounded-xl px-5 py-3 text-sm font-semibold text-[#0B1220] hover:bg-amber-50 transition-colors">
              <Lock className="w-4 h-4 text-gold" />
              {unlockLabel}
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        )}

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {locked ? <Lock className="w-3 h-3 text-gold/70" /> : <Sparkles className="w-3 h-3 text-gold/70" />}
            <span className="text-[10px] text-gold/75 font-medium">
              {footerText ?? `${safeScenarios.length} income paths · stress tests · 5-year projection · RRI scoring`}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gold/60" />
        </div>
      </div>

      <div className="absolute -top-3 left-6">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur ${TONE_CLS[base.tagTone]}`}>
          {base.name} · {base.tag}
        </span>
      </div>
    </div>
  );
}

function Metric({ label, value, sub, accent, accentColor, locked }: { label: string; value: ReactNode; sub: string; accent?: "down"; accentColor?: string; locked?: boolean }) {
  return (
    <div className="bg-white px-4 py-3 relative">
      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-medium mb-1">{label}</p>
      <div className={`flex items-baseline gap-1.5 ${locked ? "blur-[6px] select-none pointer-events-none" : ""}`} style={accentColor ? { color: accentColor } : undefined}>
        {value}
        {accent === "down" && <TrendingDown className="w-3 h-3 text-rose-600/60" />}
      </div>
      <p className={`text-[10px] text-slate-400 mt-0.5 truncate ${locked ? "blur-[3px] select-none" : ""}`}>{sub}</p>
    </div>
  );
}

function Sparkline({ data, depletionMonth, locked }: { data: number[]; depletionMonth?: number; locked?: boolean }) {
  const W = 360, H = 80, P = 8;
  const safe = data.length >= 2 ? data : [0, 0];
  const min = Math.min(...safe), max = Math.max(...safe);
  const range = Math.max(1, max - min);
  const pts = safe.map((v, i) => {
    const x = P + (i / (safe.length - 1)) * (W - P * 2);
    const y = H - P - ((v - min) / range) * (H - P * 2);
    return { x, y };
  });
  const path = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaPath = `${path} L ${pts[pts.length - 1].x} ${H - P} L ${pts[0].x} ${H - P} Z`;
  const last = pts[pts.length - 1];
  const endingValue = safe[safe.length - 1];
  const depletionIdx = depletionMonth !== undefined && depletionMonth > 0
    ? Math.round((depletionMonth / 60) * (pts.length - 1))
    : undefined;
  const showDepletion = depletionIdx !== undefined && endingValue <= 0 && depletionMonth! <= 60;

  return (
    <div className={`relative rounded-lg bg-slate-50/80 border border-slate-100 px-1 py-1 ${locked ? "blur-[4px] select-none" : ""}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[80px]" preserveAspectRatio="xMidYMid meet">
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={P}
            y1={H - P - frac * (H - P * 2)}
            x2={W - P}
            y2={H - P - frac * (H - P * 2)}
            stroke={chartTheme.color.grid}
            strokeWidth={1}
          />
        ))}
        <motion.path
          d={areaPath}
          fill={chartTheme.color.gold}
          fillOpacity={0.12}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke={chartTheme.color.gold}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: chartTheme.ease }}
        />
        <circle cx={last.x} cy={last.y} r={3.5} fill={chartTheme.color.gold} stroke="#fff" strokeWidth={1.5} />
        {showDepletion && depletionIdx !== undefined && (
          <g>
            <line
              x1={pts[depletionIdx].x}
              y1={H - P}
              x2={pts[depletionIdx].x}
              y2={P}
              stroke={chartTheme.color.pressure}
              strokeDasharray="3 3"
              strokeWidth={1}
              opacity={0.75}
            />
            <text x={pts[depletionIdx].x + 4} y={P + 10} fill={chartTheme.color.pressure} fontSize={9} fontFamily="Inter, sans-serif">
              Capital depletes
            </text>
          </g>
        )}
      </svg>
      <div className="flex justify-between px-2 -mt-1 pb-0.5">
        <span className="text-[8px] text-slate-400 font-mono">Yr 0</span>
        <span className="text-[8px] text-slate-400 font-mono">Yr 5</span>
      </div>
    </div>
  );
}

const SHORT_NAMES = ["Zero income", "50% income", "Delayed", "Structural"];

function scenarioShortName(name: string, index: number): string {
  if (name === "Your assumptions") return "Yours";
  if (name.startsWith("Zero")) return "Zero income";
  if (name.startsWith("50%")) return "50% income";
  if (name.includes("after")) return "Delayed";
  if (name.includes("Structural")) return "Structural";
  return SHORT_NAMES[index - 1] ?? `S${index + 1}`;
}

export function buildRunwayConsoleScenarios(scenarios: ScenarioComparison[]): RunwayConsoleScenario[] {
  return scenarios.map((s, i) => {
    const score = s.result.stabilityScore;
    let tone: RunwayConsoleScenario["tagTone"] = "balanced";
    let tag = "Balanced";
    if (score >= 70) { tone = "sustain"; tag = "Sustainable"; }
    else if (score >= 55) { tone = "balanced"; tag = "Balanced"; }
    else if (score >= 35) { tone = "stretch"; tag = "Stretched"; }
    else { tone = "complex"; tag = "Under pressure"; }

    const traj: number[] = [];
    for (let y = 0; y <= 5; y++) {
      const month = Math.min(y * 12, s.result.projections.length - 1);
      traj.push(s.result.projections[month]?.capital ?? 0);
    }
    const depletionIdx = s.result.projections.findIndex((p) => p.capital <= 0);
    const endingCapital = traj[traj.length - 1] ?? 0;
    const depl = depletionIdx > 0 && depletionIdx <= 60 && endingCapital <= 0 ? depletionIdx : undefined;

    return {
      id: `s${i + 1}`,
      name: s.name,
      shortName: scenarioShortName(s.name, i),
      tag,
      tagTone: tone,
      runwayMonths: s.result.monthsUntilDepletion,
      monthlyBurn: s.result.monthlyBurn,
      startingCapital: s.result.startingCapital,
      resilienceScore: score,
      projection: traj,
      depletionMonth: depl,
    };
  });
}

export const DEMO_CONSOLE_SCENARIOS: RunwayConsoleScenario[] = [
  { id: "s1", name: "Baseline", shortName: "Baseline", tag: "Balanced", tagTone: "balanced", runwayMonths: 10.4, monthlyBurn: 2840, startingCapital: 42850, resilienceScore: 58, projection: [42850, 38700, 34600, 30500, 26400, 22300] },
  { id: "s2", name: "Slow recovery", shortName: "Slow", tag: "Stretched", tagTone: "stretch", runwayMonths: 13.2, monthlyBurn: 2840, startingCapital: 42850, resilienceScore: 48, projection: [42850, 39400, 36100, 32800, 29500, 26200] },
  { id: "s3", name: "Zero income", shortName: "Zero", tag: "Under pressure", tagTone: "complex", runwayMonths: 5.1, monthlyBurn: 3120, startingCapital: 42850, resilienceScore: 28, projection: [42850, 35100, 27350, 19600, 8200, 0], depletionMonth: 55 },
  { id: "s4", name: "One-income household", shortName: "One-income", tag: "Sustainable", tagTone: "sustain", runwayMonths: 18.7, monthlyBurn: 1980, startingCapital: 42850, resilienceScore: 72, projection: [42850, 40470, 38090, 35710, 33330, 30950] },
];

export const DEMO_COMPOSITION = [
  { label: "Cash savings", value: 18500, color: chartTheme.color.cash },
  { label: "Liquid investments", value: 12350, color: chartTheme.color.investments },
  { label: "Redundancy package", value: 12000, color: chartTheme.color.redundancy },
];

export function sensitivityToStressBars(items: SensitivityResult[]) {
  const max = Math.max(...items.map((i) => Math.abs(i.difference)), 1);
  return items.slice(0, 4).map((item) => ({
    label: item.label,
    pct: Math.min(100, Math.round((Math.abs(item.difference) / max) * 80 + 20)),
  }));
}
