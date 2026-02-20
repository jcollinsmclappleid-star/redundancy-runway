import { TrendingDown } from "lucide-react";
import { Link } from "wouter";

export function Logo({ showTagline = false }: { showTagline?: boolean }) {
  return (
    <Link href="/" data-testid="link-home">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
          <TrendingDown className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight">RedundancyRunway</span>
          {showTagline && (
            <span className="text-[10px] text-muted-foreground tracking-wide">Financial Projection Tool</span>
          )}
        </div>
      </div>
    </Link>
  );
}
