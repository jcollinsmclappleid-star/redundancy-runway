import { Link } from "wouter";
import logoMark from "@assets/generated_images/logo-mark.png";

export function Logo({ showTagline = false }: { showTagline?: boolean }) {
  return (
    <Link href="/" data-testid="link-home">
      <div className="flex items-center gap-2.5 cursor-pointer">
        <img
          src={logoMark}
          alt="RedundancyCalculatorUK logo"
          className="w-8 h-8 rounded-md object-cover"
        />
        <div className="flex flex-col">
          <span className="font-serif font-semibold text-sm tracking-tight">RedundancyCalculatorUK</span>
          {showTagline && (
            <span className="text-[10px] text-muted-foreground tracking-wide">Private Redundancy Runway Report</span>
          )}
        </div>
      </div>
    </Link>
  );
}
