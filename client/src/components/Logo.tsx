import { Link } from "wouter";

export function Logo({ showTagline = false, light = false }: { showTagline?: boolean; light?: boolean }) {
  return (
    <Link href="/" data-testid="link-home">
      <div className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(38 72% 52%), hsl(42 80% 60%))" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 1.5L2.25 4.5V9C2.25 12.7 5.25 16.17 9 17.25C12.75 16.17 15.75 12.7 15.75 9V4.5L9 1.5Z"
              stroke="hsl(215 50% 8%)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="none"
            />
            <text x="6.2" y="12.2" fontSize="7" fontWeight="700" fill="hsl(215 50% 8%)" fontFamily="serif">R</text>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className={`font-serif font-semibold text-sm tracking-tight ${light ? "text-white" : "text-foreground"}`}>
            RedundancyCalculatorUK
          </span>
          {showTagline && (
            <span className={`text-[10px] tracking-wide ${light ? "text-white/60" : "text-muted-foreground"}`}>
              Private Redundancy Runway Report
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
