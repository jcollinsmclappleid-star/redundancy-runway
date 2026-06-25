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
  const large = size === "large" || light;
  const footer = size === "footer";
  const useFullLogo = light || onDark;

  return (
    <Link href="/" data-testid="link-home">
      <div className={`flex items-center cursor-pointer ${footer ? "gap-2.5" : "gap-3"}`}>
        {useFullLogo ? (
          <img
            src="/logo.png"
            alt="RedundancyCalculatorUK"
            className={
              large
                ? "h-28 sm:h-32 md:h-36 w-auto max-w-[min(100%,520px)] object-contain object-left"
                : onDark
                  ? "h-10 sm:h-11 w-auto max-w-[min(100%,280px)] object-contain object-left"
                  : "h-12 sm:h-14 w-auto max-w-[min(100%,320px)] object-contain object-left"
            }
            data-testid="logo-image"
          />
        ) : (
          <>
            <img
              src="/logo-mark.png"
              alt=""
              aria-hidden="true"
              className={`shrink-0 object-contain ${
                footer
                  ? "h-10 w-10"
                  : large
                    ? "h-14 w-14 sm:h-16 sm:w-16"
                    : "h-11 w-11 sm:h-12 sm:w-12"
              }`}
              data-testid="logo-mark"
            />
            <div className="flex flex-col min-w-0">
              <span
                className={`font-serif font-semibold tracking-tight leading-tight ${
                  onDark ? "text-primary-foreground" : "text-foreground"
                } ${footer ? "text-sm" : large ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}
              >
                RedundancyCalculator
                <span className="text-[hsl(38_72%_47%)]">UK</span>
              </span>
              {showTagline && (
                <span
                  className={`tracking-wide leading-snug ${
                    onDark ? "text-primary-foreground/70" : "text-muted-foreground"
                  } ${footer ? "text-[10px] mt-0.5" : large ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs"}`}
                >
                  {RUNWAY_REPORT_FULL}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
