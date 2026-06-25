export const chartTheme = {
  font: {
    family: '"Inter", system-ui, sans-serif',
    serif: '"Playfair Display", Georgia, serif',
    mono: 'ui-monospace, monospace',
  },
  color: {
    gold: "#C9A84C",
    goldSoft: "#E0C77C",
    ink: "#0F1B2D",
    inkSoft: "#1a3357",
    paper: "#FFFFFF",
    grid: "rgba(15,27,45,0.06)",
    muted: "#6B7280",
    sustain: "#10B981",
    attention: "#F59E0B",
    pressure: "#EF4444",
    s1: "#2563EB",
    s2: "#10B981",
    s3: "#8B5CF6",
    s4: "#F59E0B",
    cash: "#C9A84C",
    investments: "#22D3EE",
    redundancy: "#A78BFA",
  },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

/** Landing hero — brand navy / gold palette */
export const heroTheme = {
  navy: chartTheme.color.ink,
  navySoft: chartTheme.color.inkSoft,
  navyMid: "#243d66",
  navyLight: "#2d4a7a",
  gold: chartTheme.color.gold,
  goldSoft: chartTheme.color.goldSoft,
  cream: chartTheme.color.paper,
  textMuted: "#94a3b8",
  textSubtle: "#64748b",
  border: "rgba(255,255,255,0.12)",
  cardBorder: "#e2e8f0",
  gradient: "linear-gradient(165deg, #0F1B2D 0%, #1a3357 38%, #243d66 72%, #2d4a7a 100%)",
  gradientHeader: "rgba(15, 27, 45, 0.97)",
};

export function gaugeColor(score: number) {
  if (score >= 70) return { stroke: chartTheme.color.sustain, label: "Sustainable", tone: "emerald" as const };
  if (score >= 40) return { stroke: chartTheme.color.attention, label: "Attention needed", tone: "amber" as const };
  return { stroke: chartTheme.color.pressure, label: "Under pressure", tone: "red" as const };
}

export function fmtK(v: number) {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}m`;
  if (abs >= 1000) return `£${Math.round(v / 1000)}k`;
  return `£${Math.round(v)}`;
}

export function fmtGbp(v: number) {
  return `£${Math.abs(Math.round(v)).toLocaleString("en-GB")}`;
}

export function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

export function densifyProjection(yearly: number[], seed = 0): number[] {
  if (yearly.length < 2) return yearly.length ? yearly : [0, 0];
  const out: number[] = [];
  const steps = 12;
  for (let y = 0; y < yearly.length - 1; y++) {
    const a = yearly[y];
    const b = yearly[y + 1];
    for (let m = 0; m < steps; m++) {
      const t = m / steps;
      const wobble = Math.sin((y * steps + m + seed) * 0.4) * Math.abs(b - a) * 0.04;
      out.push(a + (b - a) * t + wobble);
    }
  }
  out.push(yearly[yearly.length - 1]);
  return out;
}
