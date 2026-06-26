import { Link } from "wouter";
import { RUNWAY_REPORT_FULL } from "@shared/product";

type LogoSize = "header" | "large" | "footer";

export function Logo({
  showTagline = false,
  light = false,
  onDark = false,
  size = "header",
}: {
  showTagline?: boolean;
  light?: boolean;
  /** Wordmark visible on dark backgrounds (e.g. navy header). Prefer a light page header when possible. */
  onDark?: boolean;
  size?: LogoSize;
}) {
  const large = size === "large";
  const footer = size === "footer";
  const onDarkSurface = light || onDark;

  return (
    <Link href="/" data-testid="link-home">
      <div className={`flex items-center cursor-pointer ${footer ? "gap-2" : "gap-2.5"}`}>
        <img
          src="/logo-mark.png"
          alt=""
          aria-hidden="true"
          className={`shrink-0 object-contain ${
            footer
              ? "h-8 w-8"
              : large
                ? "h-11 w-11 sm:h-[3.25rem] sm:w-[3.25rem]"
                : "h-9 w-9 sm:h-[2.35rem] sm:w-[2.35rem]"
          }`}
          data-testid="logo-mark"
        />
        <div className="flex flex-col min-w-0">
          <span
            className={`font-serif font-semibold tracking-tight leading-tight ${
              onDarkSurface ? "text-primary-foreground" : "text-foreground"
            } ${footer ? "text-[13px]" : large ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}
          >
            RedundancyCalculator
            <span className="text-[hsl(38_72%_47%)]">UK</span>
          </span>
          {showTagline && (
            <span
              className={`tracking-wide leading-snug ${
                onDarkSurface ? "text-primary-foreground/70" : "text-muted-foreground"
              } ${footer ? "text-[9px] mt-0.5" : large ? "text-[11px] sm:text-xs" : "text-[10px] sm:text-[11px]"}`}
            >
              {RUNWAY_REPORT_FULL}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
