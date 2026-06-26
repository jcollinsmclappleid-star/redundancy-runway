import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Home,
  Users,
  BadgePoundSterling,
  Clock,
} from "lucide-react";
import { heroTheme } from "@/lib/chart-theme";
import heroLandscape from "@assets/generated_images/hero-road-landscape.png";

type Anchor = { top: string; left?: string; right?: string };

type SignpostDef = {
  id: string;
  icon: LucideIcon;
  label: string;
  sub: string;
  anchor: Anchor;
  road: { x: number; y: number };
};

const PACKAGE_CHIPS = ["Statutory", "Notice", "Holiday", "Enhanced"] as const;

const MOBILE_SIGNPOSTS: SignpostDef[] = [
  {
    id: "pay",
    icon: Calculator,
    label: "Full package",
    sub: "£34,200 sample",
    anchor: { top: "5%", left: "2%" },
    road: { x: 24, y: 76 },
  },
  {
    id: "slow",
    icon: Clock,
    label: "Slow recovery",
    sub: "Longer job search",
    anchor: { top: "5%", right: "2%" },
    road: { x: 76, y: 74 },
  },
  {
    id: "household",
    icon: Users,
    label: "Household impact",
    sub: "One income supporting household",
    anchor: { top: "58%", left: "2%" },
    road: { x: 26, y: 88 },
  },
  {
    id: "mortgage",
    icon: Home,
    label: "Mortgage pressure",
    sub: "If rates rise",
    anchor: { top: "58%", right: "2%" },
    road: { x: 74, y: 86 },
  },
];

const DESKTOP_SIGNPOSTS: SignpostDef[] = [
  {
    id: "pay",
    icon: Calculator,
    label: "Redundancy package",
    sub: "£34,200 sample",
    anchor: { top: "6%", left: "2%" },
    road: { x: 26, y: 68 },
  },
  {
    id: "slow",
    icon: Clock,
    label: "Slow recovery",
    sub: "What if a new role takes longer?",
    anchor: { top: "8%", right: "2%" },
    road: { x: 74, y: 66 },
  },
  {
    id: "mortgage",
    icon: Home,
    label: "Mortgage pressure",
    sub: "At risk if rates rise",
    anchor: { top: "46%", left: "1%" },
    road: { x: 30, y: 78 },
  },
  {
    id: "household",
    icon: Users,
    label: "Household impact",
    sub: "One income supporting household",
    anchor: { top: "48%", right: "2%" },
    road: { x: 72, y: 76 },
  },
];

const ROAD_MARKERS = [
  { icon: Home, label: "Mortgage", left: "22%" },
  { icon: BadgePoundSterling, label: "Capital", left: "50%" },
  { icon: Users, label: "Household", left: "78%" },
];

function anchorToPercent(anchor: Anchor): { x: number; y: number } {
  const y = parseFloat(anchor.top);
  let x = 50;
  if (anchor.left) x = parseFloat(anchor.left) + 10;
  if (anchor.right) x = 100 - parseFloat(anchor.right) - 10;
  return { x, y: y + 6 };
}

function ConnectorLines({ signposts }: { signposts: SignpostDef[] }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-testid="hero-connectors"
    >
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
            strokeOpacity="0.45"
          />
        );
      })}
    </svg>
  );
}

function SignpostCard({
  icon: Icon,
  label,
  sub,
  featured,
  compact,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  featured?: boolean;
  compact?: boolean;
}) {
  if (featured) {
    return (
      <div className="rounded-lg border border-slate-200/90 bg-white/[0.97] shadow-lg backdrop-blur-sm">
        <div className={compact ? "p-2" : "p-2.5"}>
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className={`rounded-md flex items-center justify-center shrink-0 ${compact ? "w-5 h-5" : "w-6 h-6"}`}
              style={{ background: `${heroTheme.gold}22` }}
            >
              <Icon className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} style={{ color: heroTheme.gold }} />
            </div>
            <p className={`font-semibold text-slate-800 leading-tight ${compact ? "text-[9px]" : "text-[11px]"}`}>
              {label}
            </p>
          </div>
          <p className={`font-serif font-bold text-[#1a3357] leading-none ${compact ? "text-base" : "text-xl"}`}>
            {sub}
          </p>
          <div className="flex flex-wrap gap-0.5 mt-1.5">
            {PACKAGE_CHIPS.map((chip) => (
              <span
                key={chip}
                className={`rounded-full bg-slate-100 font-medium text-slate-600 ${
                  compact ? "px-1 py-px text-[7px]" : "px-1.5 py-0.5 text-[8px]"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200/90 bg-white/[0.97] shadow-lg backdrop-blur-sm">
      <div className={`flex items-start gap-1.5 ${compact ? "p-2" : "p-2.5"}`}>
        <div
          className={`rounded-md flex items-center justify-center shrink-0 mt-0.5 ${compact ? "w-5 h-5" : "w-6 h-6"}`}
          style={{ background: `${heroTheme.gold}18` }}
        >
          <Icon className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} style={{ color: heroTheme.gold }} />
        </div>
        <div className="min-w-0">
          <p className={`font-semibold text-slate-800 leading-tight ${compact ? "text-[9px]" : "text-[11px]"}`}>
            {label}
          </p>
          <p className={`text-slate-500 leading-snug ${compact ? "text-[8px] line-clamp-2" : "text-[10px]"}`}>
            {sub}
          </p>
        </div>
      </div>
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
          <p
            className={`font-medium text-white/80 drop-shadow-md whitespace-nowrap ${
              compact ? "text-[7px]" : "text-[9px]"
            }`}
          >
            {m.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function HeroRoadScene({ isMobile, className = "" }: { isMobile: boolean; className?: string }) {
  const signposts = isMobile ? MOBILE_SIGNPOSTS : DESKTOP_SIGNPOSTS;
  const signpostWidth = isMobile ? 112 : 148;
  const payWidth = isMobile ? 116 : 160;

  return (
    <div
      className={`relative w-full overflow-hidden ${
        isMobile ? "min-h-[380px] px-3 pb-8" : "h-full min-h-[540px] rounded-2xl"
      } ${className}`}
      data-testid={isMobile ? "hero-mobile-visual" : "hero-desktop-visual"}
    >
      <img
        src={heroLandscape}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: isMobile ? "50% 30%" : "50% 28%" }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? `linear-gradient(to bottom, transparent 0%, transparent 72%, rgba(15, 27, 45, 0.3) 100%)`
            : `linear-gradient(135deg, transparent 0%, transparent 30%, transparent 75%, rgba(15, 27, 45, 0.32) 100%)`,
        }}
      />

      <ConnectorLines signposts={signposts} />
      <RoadMarkers compact={isMobile} />

      {signposts.map((s) => (
        <div
          key={s.id}
          className="absolute z-10"
          style={{
            top: s.anchor.top,
            left: s.anchor.left,
            right: s.anchor.right,
            width: s.id === "pay" ? payWidth : signpostWidth,
            maxWidth: s.id === "pay" ? payWidth : signpostWidth,
          }}
          data-testid={`hero-signpost-${s.id}`}
        >
          {s.id === "pay" ? (
            <SignpostCard icon={s.icon} label={s.label} sub={s.sub} featured compact={isMobile} />
          ) : (
            <SignpostCard icon={s.icon} label={s.label} sub={s.sub} compact={isMobile} />
          )}
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
  return <HeroRoadScene isMobile={variant === "mobile"} className={className} />;
}
