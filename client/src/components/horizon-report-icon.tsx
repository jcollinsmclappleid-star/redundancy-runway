import { useId } from "react";
import { heroTheme } from "@/lib/chart-theme";

/** Glowing report document at the road horizon — matches logo / favicon */
export function HorizonReportIcon({ size = 72, className = "" }: { size?: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const h = size;
  const w = size * 0.72;

  return (
    <div className={`relative ${className}`} style={{ width: w * 1.8, height: h * 1.8 }} aria-hidden="true">
      {/* Ambient glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: h * 2.4,
          height: h * 2.4,
          background: `radial-gradient(circle, ${heroTheme.gold}55 0%, ${heroTheme.gold}18 45%, transparent 70%)`,
        }}
      />
      {/* Light rays */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%]"
        width={w * 2}
        height={h * 1.2}
        viewBox="0 0 80 48"
        fill="none"
      >
        {[-24, -12, 0, 12, 24].map((angle) => (
          <line
            key={angle}
            x1="40"
            y1="44"
            x2={40 + Math.sin((angle * Math.PI) / 180) * 28}
            y2={44 - Math.cos((angle * Math.PI) / 180) * 32}
            stroke={heroTheme.gold}
            strokeWidth="1.2"
            strokeOpacity="0.35"
          />
        ))}
      </svg>
      {/* Report document */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%]"
        width={w}
        height={h}
        viewBox="0 0 36 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`reportBody-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="45%" stopColor={heroTheme.goldSoft} />
            <stop offset="100%" stopColor={heroTheme.gold} />
          </linearGradient>
          <filter id={`reportGlow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="4" y="6" width="28" height="36" rx="2" fill={`url(#reportBody-${uid})`} filter={`url(#reportGlow-${uid})`} stroke="#E8D5A3" strokeWidth="0.75" />
        {/* Dog-ear fold */}
        <path d="M24 6 L32 6 L32 14 L24 6 Z" fill="#E0C77C" stroke="#C9A84C" strokeWidth="0.5" />
        <path d="M24 6 L32 14 L24 14 Z" fill="#F5E6B8" opacity="0.9" />
        {/* Text lines */}
        <rect x="9" y="18" width="16" height="2" rx="1" fill={heroTheme.navy} opacity="0.55" />
        <rect x="9" y="24" width="14" height="2" rx="1" fill={heroTheme.navy} opacity="0.45" />
        <rect x="9" y="30" width="12" height="2" rx="1" fill={heroTheme.navy} opacity="0.35" />
      </svg>
    </div>
  );
}
