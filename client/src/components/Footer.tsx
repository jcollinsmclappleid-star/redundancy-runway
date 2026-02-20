export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-medium mb-2">RedundancyRunway</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Illustrative financial projection modelling. Based solely on user-entered assumptions.
            </p>
          </div>
          <div>
            <p className="font-medium mb-2">Legal</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
              <li>Methodology</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Important</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              This tool does not provide financial, employment, debt, or benefits advice. All projections are estimates and may not reflect your actual circumstances.
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} RedundancyRunway. All rights reserved. v1.0 | Data assumptions as of February 2026.
        </div>
      </div>
    </footer>
  );
}
