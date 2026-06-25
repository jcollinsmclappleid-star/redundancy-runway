import { SITE_NAME, SITE_URL, RUNWAY_BRIEF_NAME, RUNWAY_REPORT_FULL } from "@shared/product";

type BrandVariant = "light" | "dark";
type BrandContext = "brief" | "report" | "site";

interface RunwayReportBrandProps {
  /** light = on navy/primary backgrounds; dark = on white/cream */
  variant?: BrandVariant;
  /** Which product line to emphasise */
  context?: BrandContext;
  showTagline?: boolean;
  showUrl?: boolean;
  className?: string;
}

export function RunwayReportBrand({
  variant = "light",
  context = "brief",
  showTagline = true,
  showUrl = false,
  className = "",
}: RunwayReportBrandProps) {
  const onLight = variant === "light";
  const productLabel =
    context === "brief"
      ? RUNWAY_BRIEF_NAME
      : context === "report"
        ? RUNWAY_REPORT_FULL
        : SITE_NAME;

  return (
    <div className={`flex items-center gap-3 min-w-0 ${className}`} data-testid="runway-report-brand">
      <img
        src="/logo-mark.png"
        alt=""
        aria-hidden="true"
        className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 object-contain"
      />
      <div className="flex flex-col min-w-0">
        <span
          className={`font-serif font-semibold tracking-tight leading-tight truncate ${
            onLight ? "text-white" : "text-foreground"
          } text-sm sm:text-base`}
        >
          RedundancyCalculator
          <span className="text-[hsl(38_72%_55%)]">UK</span>
        </span>
        {showTagline && (
          <span
            className={`text-[10px] sm:text-[11px] tracking-wide leading-snug truncate ${
              onLight ? "text-white/65" : "text-muted-foreground"
            }`}
          >
            {productLabel}
          </span>
        )}
        {showUrl && (
          <span className={`text-[9px] mt-0.5 ${onLight ? "text-white/45" : "text-muted-foreground/80"}`}>
            {SITE_URL.replace(/^https?:\/\//, "")}
          </span>
        )}
      </div>
    </div>
  );
}
