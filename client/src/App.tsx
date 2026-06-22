import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import WizardPage from "@/pages/wizard";
import PreviewPage from "@/pages/preview";
import ResultsPage from "@/pages/results";
import RedundancyResetPage from "@/pages/redundancy-reset";
import RedundancyResetIntakePage from "@/pages/redundancy-reset-intake";
import AdminResetsPage from "@/pages/admin/resets";
import StatutoryRedundancyPayPage from "@/pages/seo/statutory-redundancy-pay";
import RedundancyRightsUKPage from "@/pages/seo/redundancy-rights-uk";
import HowLongRedundancyMoneyLastPage from "@/pages/seo/how-long-does-redundancy-money-last";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/wizard" component={WizardPage} />
      <Route path="/preview" component={PreviewPage} />
      <Route path="/results" component={ResultsPage} />
      <Route path="/redundancy-reset" component={RedundancyResetPage} />
      <Route path="/redundancy-reset/intake" component={RedundancyResetIntakePage} />
      <Route path="/admin/resets" component={AdminResetsPage} />
      <Route path="/statutory-redundancy-pay" component={StatutoryRedundancyPayPage} />
      <Route path="/redundancy-rights-uk" component={RedundancyRightsUKPage} />
      <Route path="/how-long-does-redundancy-money-last" component={HowLongRedundancyMoneyLastPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
