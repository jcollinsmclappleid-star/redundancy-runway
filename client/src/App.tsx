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
import RedundancyMortgagePage from "@/pages/seo/redundancy-mortgage";
import VoluntaryRedundancyPage from "@/pages/seo/voluntary-redundancy";
import AboutPage from "@/pages/about";

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
      <Route path="/redundancy-mortgage" component={RedundancyMortgagePage} />
      <Route path="/voluntary-redundancy" component={VoluntaryRedundancyPage} />
      <Route path="/about" component={AboutPage} />
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
