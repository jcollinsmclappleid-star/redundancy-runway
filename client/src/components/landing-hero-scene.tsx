import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  TrendingDown,
  Check,
  Home,
  Users,
  Heart,
  BadgePoundSterling,
  Clock,
} from "lucide-react";
import { heroTheme } from "@/lib/chart-theme";
import { HorizonReportIcon } from "@/components/horizon-report-icon";
import heroLandscape from "@assets/generated_images/hero-road-landscape.png";

const REPORT_ITEMS = [
  "Slow recovery",
  "Mortgage pressure",
  "One-income household",
  "Voluntary redundancy",
  "Structural transition",
];

type Anchor = { top: string; left?: string; right?: string };

type SignpostDef = {
  id: string;
  icon: LucideIcon;
  label: string;
  sub: string;
  anchor: Anchor;
  /** Connector line end on road (viewBox 0–100) */
  road: { x: number; y: number };
};

const MOBILE_SIGNPOSTS: SignpostDef[] = [
  {
    id: "pay",
    icon: Calculator,
    label: "Redundancy pay",
    sub: "£28,650 statutory",
    anchor: { top: "42%", left: "3%" },
    road: { x: 24, y: 72 },
  },
  {
    id: "slow",
    icon: TrendingDown,
    label: "Slow recovery",
    sub: "Longer job search",
    anchor: { top: "50%", right: "3%" },
    road: { x: 65, y: 62 },
  },
  {
    id: "mortgage",
    icon: Home,
    label: "Mortgage pressure",
    sub: "If rates rise",
    anchor: { top: "62%", left: "2%" },
    road: { x: 30, y: 74 },
  },
  {
    id: "household",
    icon: Users,
    label: "Household impact",
    sub: "One income",
    anchor: { top: "72%", right: "3%" },
    road: { x: 74, y: 78 },
  },
  {
    id: "support",
    icon: Heart,
    label: "Support if needed",
    sub: "Next steps",
    anchor: { top: "82%", left: "6%" },
    road: { x: 50, y: 84 },
  },
];

const DESKTOP_SIGNPOSTS: SignpostDef[] = [
  {
    id: "pay",
    icon: Calculator,
    label: "Redundancy pay estimate",
    sub: "£28,650 statutory",
    anchor: { top: "10%", left: "4%" },
    road: { x: 30, y: 72 },
  },
  {
    id: "slow",
    icon: Clock,
    label: "Slow recovery",
    sub: "What if a new role takes longer?",
    anchor: { top: "32%", left: "2%" },
    road: { x: 42, y: 52 },
  },
  {
    id: "mortgage",
    icon: Home,
    label: "Mortgage pressure",
    sub: "At risk if rates rise",
    anchor: { top: "54%", left: "2%" },
    road: { x: 36, y: 66 },
  },
  {
    id: "household",
    icon: Users,
    label: "Household impact",
    sub: "One income supporting household",
    anchor: { top: "68%", left: "4%" },
    road: { x: 32, y: 80 },
  },
];

const ROAD_MARKERS = [
  { icon: Home, label: "Mortgage", left: "22%" },
  { icon: BadgePoundSterling, label: "Capital", left: "50%" },
  { icon: Users, label: "Household", left: "78%" },
];

/** Where the road meets the horizon in the landscape image */
const HORIZON = {
  mobile: { top: "8%", left: "56%" },
  desktop: { top: "7%", left: "50%" },
} as const;

/** Report card sits *below* the horizon beacon — road leads to the glow, card is the payoff */
const REPORT_ANCHOR = {
  mobile: { top: "21%", left: "56%" },
  desktop: { top: "17%", left: "50%" },
} as const;

function anchorToPercent(anchor: Anchor): { x: number; y: number } {
  const y = parseFloat(anchor.top);
  let x = 50;
  if (anchor.left) x = parseFloat(anchor.left) + 12;
  if (anchor.right) x = 100 - parseFloat(anchor.right) - 12;
  return { x, y: y + 8 };
}

function ConnectorLines({
  signposts,
  horizon,
  report,
}: {
  signposts: SignpostDef[];
  horizon: { x: number; y: number };
  report: { x: number; y: number };
}) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-testid="hero-connectors"
    >
      {/* Road terminus → horizon glow */}
      <line
        x1={horizon.x}
        y1={horizon.y + 6}
        x2={horizon.x}
        y2={horizon.y}
        stroke={heroTheme.gold}
        strokeWidth="0.5"
        strokeOpacity="0.7"
      />
      {/* Horizon → report destination */}
      <line
        x1={horizon.x}
        y1={horizon.y + 2}
        x2={report.x}
        y2={report.y}
        stroke={heroTheme.gold}
        strokeWidth="0.35"
        strokeDasharray="1.2 1.8"
        strokeOpacity="0.55"
      />
      {signposts.map((s) => {
        const from = anchorToPercent(s.anchor);
        return (
          <line
            key={s.id}
            x1={from.x}
            y1={from.y}
            x2={s.road.x}
            y2={s.road.y}
            stroke={heroTheme.gold}
            strokeWidth="0.35"
            strokeDasharray="1.2 1.8"
            strokeOpacity="0.5"
          />
        );
      })}
    </svg>
  );
}

/** Glowing report at the horizon — road destination (logo metaphor) */
function HorizonGoal({ top, left, compact }: { top: string; left: string; compact?: boolean }) {
  const size = compact ? 48 : 64;
  return (
    <div
      className="absolute z-[25] -translate-x-1/2 -translate-y-[60%] pointer-events-none"
      style={{ top, left }}
      data-testid="hero-horizon-goal"
      aria-hidden="true"
    >
      <HorizonReportIcon size={size} />
    </div>
  );
}

function DarkCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl border shadow-xl backdrop-blur-md ${className}`}
      style={{
        background: "rgba(11, 25, 46, 0.94)",
        borderColor: "rgba(201, 168, 76, 0.28)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Compact road-side signpost */
function SignpostCard({
  icon: Icon,
  label,
  sub,
  compact,
  featured,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  compact?: boolean;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <DarkCard>
        <div className={compact ? "p-2.5" : "p-3"}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div
              className={`rounded-md flex items-center justify-center shrink-0 ${compact ? "w-5 h-5" : "w-6 h-6"}`}
              style={{ background: `${heroTheme.gold}28` }}
            >
              <Icon className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} style={{ color: heroTheme.goldSoft }} />
            </div>
            <p className={`font-semibold text-white/90 leading-tight ${compact ? "text-[8px]" : "text-[10px]"}`}>{label}</p>
          </div>
          <p className={`font-serif font-bold text-white leading-none ${compact ? "text-xl" : "text-2xl"}`}>{sub}</p>
          <p className={`text-white/50 mt-0.5 ${compact ? "text-[7px]" : "text-[9px]"}`}>Statutory estimate</p>
        </div>
      </DarkCard>
    );
  }

  return (
    <DarkCard>
      <div className={`flex items-start gap-1.5 ${compact ? "p-2" : "p-2.5"}`}>
        <div
          className={`rounded-md flex items-center justify-center shrink-0 mt-0.5 ${compact ? "w-5 h-5" : "w-6 h-6"}`}
          style={{ background: `${heroTheme.gold}22` }}
        >
          <Icon className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} style={{ color: heroTheme.goldSoft }} />
        </div>
        <div className="min-w-0">
          <p className={`font-semibold text-white/90 leading-tight ${compact ? "text-[8px]" : "text-[10px]"}`}>{label}</p>
          <p className={`text-white/50 leading-snug ${compact ? "text-[7px] line-clamp-2" : "text-[9px]"}`}>{sub}</p>
        </div>
      </div>
    </DarkCard>
  );
}

function ReportCard({ compact, destination }: { compact?: boolean; destination?: boolean }) {
  return (
    <div
      className="rounded-xl border overflow-hidden shadow-2xl"
      style={{
        background: destination ? "rgba(255,255,255,0.97)" : heroTheme.cream,
        borderColor: heroTheme.cardBorder,
        boxShadow: destination
          ? "0 8px 28px rgba(0,0,0,0.28), 0 0 0 1px rgba(201,168,76,0.35)"
          : "0 12px 40px rgba(0,0,0,0.35), 0 0 24px rgba(201,168,76,0.12)",
      }}
      data-testid="hero-report-card"
    >
      <div className={destination ? "px-3 py-2.5" : compact ? "p-2.5" : "px-4 pt-4 pb-1"}>
        <p
          className={`font-semibold tracking-widest uppercase ${destination ? "text-[7px] mb-1" : compact ? "text-[8px] mb-1" : "text-[9px] mb-2"}`}
          style={{ color: heroTheme.gold }}
        >
          Your Runway Report
        </p>
        <div className="flex items-end gap-1 mb-0">
          <span
            className={`font-serif font-bold leading-none ${destination ? "text-lg" : compact ? "text-xl" : "text-3xl"}`}
            style={{ color: heroTheme.navySoft }}
          >
            10.4
          </span>
          <span className={`mb-0.5 ${destination ? "text-[8px]" : compact ? "text-[9px]" : "text-xs"}`} style={{ color: heroTheme.textSubtle }}>
            months
          </span>
        </div>
        <p className={`${destination ? "text-[7px] mb-1" : compact ? "text-[8px] mb-1.5" : "text-[10px] mb-3"}`} style={{ color: heroTheme.textSubtle }}>
          {destination ? "Baseline runway" : compact ? "at current burn rate" : "Baseline runway estimate"}
        </p>
        <div className={`rounded-md border border-slate-100 bg-slate-50 ${destination ? "px-1.5 py-1" : compact ? "px-2 py-1 mb-1.5" : "px-2 py-1.5 mb-3"}`}>
          <p className={`mb-0.5 ${destination ? "text-[6px]" : compact ? "text-[7px]" : "text-[9px]"}`} style={{ color: heroTheme.textSubtle }}>
            Results under scenarios
          </p>
          <p className={`font-semibold ${destination ? "text-[8px]" : compact ? "text-[9px]" : "text-xs"}`} style={{ color: heroTheme.navySoft }}>
            Range 5.1 – 18.7 {compact || destination ? "mo" : "months"}
          </p>
        </div>
      </div>
      {!destination && (
        <div className={compact ? "px-2.5 pb-2.5" : "px-4 pb-4"}>
          {(compact ? REPORT_ITEMS.slice(0, 3) : REPORT_ITEMS).map((item) => (
            <div key={item} className={`flex items-center gap-1 ${compact ? "mb-0.5" : "mb-1"}`}>
              <Check className={`shrink-0 ${compact ? "w-2 h-2" : "w-2.5 h-2.5"}`} style={{ color: heroTheme.gold }} />
              <span className={`leading-tight ${compact ? "text-[7px]" : "text-[10px]"}`} style={{ color: heroTheme.textSubtle }}>
                {item}
              </span>
            </div>
          ))}
          <p className={`mt-1.5 text-slate-400 ${compact ? "text-[7px]" : "text-[8px]"}`}>
            Illustrative sample. Not financial advice.
          </p>
        </div>
      )}
    </div>
  );
}

function RoadMarkers({ compact }: { compact?: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-[5%] z-20 pointer-events-none" data-testid="hero-road-markers">
      {ROAD_MARKERS.map((m) => (
        <div
          key={m.label}
          className="absolute flex flex-col items-center gap-1 -translate-x-1/2"
          style={{ left: m.left, bottom: 0 }}
        >
          <div
            className={`rounded-full flex items-center justify-center border-2 ${compact ? "w-7 h-7" : "w-9 h-9"}`}
            style={{
              background: `linear-gradient(145deg, ${heroTheme.gold} 0%, #E8C96A 100%)`,
              borderColor: "rgba(255,255,255,0.35)",
              boxShadow: `0 0 16px ${heroTheme.gold}88, 0 4px 12px rgba(0,0,0,0.4)`,
            }}
          >
            <m.icon className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} style={{ color: heroTheme.navy }} />
          </div>
          {!compact && <p className="text-[9px] font-medium text-white/70 drop-shadow-md whitespace-nowrap">{m.label}</p>}
        </div>
      ))}
    </div>
  );
}

interface LandingHeroSceneProps {
  variant: "mobile" | "desktop";
  className?: string;
}

export function LandingHeroScene({ variant, className = "" }: LandingHeroSceneProps) {
  const isMobile = variant === "mobile";
  const signposts = isMobile ? MOBILE_SIGNPOSTS : DESKTOP_SIGNPOSTS;
  const signpostWidth = isMobile ? 118 : 152;
  const horizon = isMobile ? HORIZON.mobile : HORIZON.desktop;
  const reportAnchor = isMobile ? REPORT_ANCHOR.mobile : REPORT_ANCHOR.desktop;

  const horizonSvg = { x: parseFloat(horizon.left), y: parseFloat(horizon.top) };
  const reportSvg = { x: parseFloat(reportAnchor.left), y: parseFloat(reportAnchor.top) + 6 };

  return (
    <div
      className={`relative w-full overflow-hidden ${isMobile ? "min-h-[540px] sm:min-h-[580px]" : "h-full min-h-[540px] rounded-2xl"} ${className}`}
      data-testid={isMobile ? "hero-mobile-visual" : "hero-desktop-visual"}
    >
      <img
        src={heroLandscape}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: isMobile ? "56% 28%" : "50% 26%" }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? `linear-gradient(to bottom,
                transparent 0%,
                transparent 18%,
                transparent 78%,
                rgba(15, 27, 45, 0.5) 100%)`
            : `linear-gradient(135deg,
                transparent 0%,
                transparent 25%,
                transparent 72%,
                rgba(15, 27, 45, 0.38) 100%)`,
        }}
      />

      <ConnectorLines signposts={signposts} horizon={horizonSvg} report={reportSvg} />
      <RoadMarkers compact={isMobile} />

      {/* End-goal: horizon glow — always visible above the report */}
      <HorizonGoal top={horizon.top} left={horizon.left} compact={isMobile} />

      {/* Destination report — compact, hangs below the horizon */}
      <div
        className="absolute z-20 -translate-x-1/2"
        style={{
          top: reportAnchor.top,
          left: reportAnchor.left,
          width: isMobile ? "min(148px, 36vw)" : 168,
        }}
      >
        <ReportCard destination compact={isMobile} />
      </div>

      {/* Signposts — staggered along the road, alternating sides */}
      {signposts.map((s) => (
        <div
          key={s.id}
          className="absolute z-10"
          style={{
            top: s.anchor.top,
            left: s.anchor.left,
            right: s.anchor.right,
            width: s.id === "pay" && !isMobile ? 168 : signpostWidth,
            maxWidth: s.id === "pay" ? (isMobile ? 118 : 168) : signpostWidth,
          }}
          data-testid={`hero-signpost-${s.id}`}
        >
          {s.id === "pay" ? (
            <SignpostCard icon={s.icon} label={s.label} sub="£28,650" compact={isMobile} featured />
          ) : (
            <SignpostCard icon={s.icon} label={s.label} sub={s.sub} compact={isMobile} />
          )}
        </div>
      ))}
    </div>
  );
}
