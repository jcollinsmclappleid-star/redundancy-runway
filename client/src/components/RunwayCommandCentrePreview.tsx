import { RunwayConsole, DEMO_CONSOLE_SCENARIOS, DEMO_COMPOSITION } from "@/components/runway-console";

/** Compact white-framed console preview for the problem section on the landing page. */
export function RunwayCommandCentrePreview() {
  return (
    <div className="w-full" data-testid="runway-command-centre">
      <RunwayConsole
        scenarios={DEMO_CONSOLE_SCENARIOS}
        composition={DEMO_COMPOSITION}
        hideStress
        chromeCaption="Runway Command Console"
        footerText="Illustrative example · your report uses your figures"
        autoRotate
        showInteractiveBadge
        testId="landing-problem-console"
      />
    </div>
  );
}
