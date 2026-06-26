import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAccess } from "@/hooks/use-access";
import { heroTheme } from "@/lib/chart-theme";
import { PRODUCT_COPY } from "@shared/product";

interface SiteHeaderProps {
  onDark?: boolean;
  showCta?: boolean;
}

export function SiteHeader({ onDark = false, showCta = true }: SiteHeaderProps) {
  const [, navigate] = useLocation();
  const { isAuthenticated, email, logout, isLoading } = useAccess();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={
        onDark
          ? { background: heroTheme.gradientHeader, borderColor: heroTheme.border }
          : { background: "hsl(var(--background) / 0.95)", borderColor: "hsl(var(--border))" }
      }
      data-testid="site-header"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-5 py-3 sm:py-4">
        <Logo onDark={onDark} />
        <div className="flex items-center gap-2 sm:gap-3">
          {!isLoading && isAuthenticated && email ? (
            <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: onDark ? heroTheme.textMuted : undefined }}>
              <span className="text-muted-foreground truncate max-w-[160px]">{email}</span>
              <button
                type="button"
                className="underline hover:opacity-80"
                onClick={() => void logout()}
                data-testid="button-sign-out"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/recover"
              className="text-sm font-medium underline-offset-4 hover:underline"
              style={{ color: onDark ? heroTheme.textMuted : undefined }}
              data-testid="link-sign-in"
            >
              Sign in
            </Link>
          )}
          {showCta && (
            <Button
              size="sm"
              className="btn-gold rounded-full px-4 sm:px-5 whitespace-normal h-auto min-h-9 py-2"
              onClick={() => navigate("/wizard")}
              data-testid="button-header-start"
            >
              {PRODUCT_COPY.buildCta}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
