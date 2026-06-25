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
import AccessRecoveryPage from "@/pages/recover";
import AccessPage from "@/pages/access";
import UnlockPage from "@/pages/unlock";
import PaymentSuccessPage from "@/pages/payment-success";
import ReportAccessPage from "@/pages/report-access";
import RedundancyResetPage from "@/pages/redundancy-reset";
import RedundancyResetIntakePage from "@/pages/redundancy-reset-intake";
import RedundancyResetPortalPage from "@/pages/redundancy-reset-portal";
import AdminResetsPage from "@/pages/admin/resets";
import RedundancyMortgagePage from "@/pages/seo/redundancy-mortgage";
import { createSeoCalculatorPage } from "@/pages/seo/redundancy-calculator-pages";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import BriefExamplePage from "@/pages/brief-example";

const FreeRedundancyCalculatorPage = createSeoCalculatorPage("free-redundancy-calculator");
const RedundancyPayCalculatorUkPage = createSeoCalculatorPage("redundancy-pay-calculator-uk");
const StatutoryRedundancyPayCalculatorPage = createSeoCalculatorPage("statutory-redundancy-pay-calculator");
const RedundancyCalculatorUkPage = createSeoCalculatorPage("redundancy-calculator-uk");
const RedundancyPayCalculator2026Page = createSeoCalculatorPage("redundancy-pay-calculator-2026");
const HowMuchRedundancyPayPage = createSeoCalculatorPage("how-much-redundancy-pay-will-i-get");
const HowDoesRedundancyPayWorkPage = createSeoCalculatorPage("how-does-redundancy-pay-work");
const MaximumRedundancyPayUkPage = createSeoCalculatorPage("maximum-redundancy-pay-uk");
const RedundancyPackageCalculatorPage = createSeoCalculatorPage("redundancy-package-calculator");
const EnhancedRedundancyCalculatorPage = createSeoCalculatorPage("enhanced-redundancy-calculator");
const VoluntaryRedundancyCalculatorPage = createSeoCalculatorPage("voluntary-redundancy-calculator");
const RedundancyTaxCalculatorPage = createSeoCalculatorPage("redundancy-tax-calculator");
const RedundancyPayAfterTaxCalculatorPage = createSeoCalculatorPage("redundancy-pay-after-tax-calculator");
const RedundancyNoticePayCalculatorPage = createSeoCalculatorPage("redundancy-notice-pay-calculator");
const PilonCalculatorRedundancyPage = createSeoCalculatorPage("pilon-calculator-redundancy");
const HolidayPayRedundancyCalculatorPage = createSeoCalculatorPage("holiday-pay-redundancy-calculator");
const RedundancyFinalPayCalculatorPage = createSeoCalculatorPage("redundancy-final-pay-calculator");
const RedundancyPayoutCalculatorPage = createSeoCalculatorPage("redundancy-payout-calculator");
const HowLongWillRedundancyPayLastPage = createSeoCalculatorPage("how-long-will-my-redundancy-pay-last");
const HowLongWillSavingsLastAfterRedundancyPage = createSeoCalculatorPage("how-long-will-my-savings-last-after-redundancy");
const RedundancyRunwayCalculatorPage = createSeoCalculatorPage("redundancy-runway-calculator");
const IncomeLossCalculatorUkPage = createSeoCalculatorPage("income-loss-calculator-uk");
const EmergencyFundRunwayCalculatorPage = createSeoCalculatorPage("emergency-fund-runway-calculator");
const MortgageRedundancyCalculatorPage = createSeoCalculatorPage("mortgage-redundancy-calculator");
const RedundancyAndMortgagePaymentsPage = createSeoCalculatorPage("redundancy-and-mortgage-payments");
const OneIncomeHouseholdCalculatorPage = createSeoCalculatorPage("one-income-household-calculator");
const RedundancyBudgetCalculatorPage = createSeoCalculatorPage("redundancy-budget-calculator");
const JobLossCalculatorUkPage = createSeoCalculatorPage("job-loss-calculator-uk");
const AtRiskOfRedundancyWhatToDoPage = createSeoCalculatorPage("at-risk-of-redundancy-what-to-do");
const MadeRedundantWhatNextPage = createSeoCalculatorPage("made-redundant-what-next");
const FirstWeekAfterRedundancyPage = createSeoCalculatorPage("first-week-after-redundancy");
const RedundancyActionPlanPage = createSeoCalculatorPage("redundancy-action-plan");
const RedundancyConsultationQuestionsPage = createSeoCalculatorPage("redundancy-consultation-questions");
const QuestionsToAskInRedundancyConsultationPage = createSeoCalculatorPage("questions-to-ask-in-redundancy-consultation");
const WhatToDoBeforeRedundancyConsultationPage = createSeoCalculatorPage("what-to-do-before-redundancy-consultation");
const WorriedAboutLosingYourJobPage = createSeoCalculatorPage("worried-about-losing-your-job");
const MyJobIsAtRiskPage = createSeoCalculatorPage("my-job-is-at-risk-what-should-i-do");
const RedundancyNextStepsPage = createSeoCalculatorPage("redundancy-next-steps");
const RedundancyRightsUkPage = createSeoCalculatorPage("redundancy-rights-uk");
const BenefitsAfterRedundancyPage = createSeoCalculatorPage("benefits-after-redundancy");
const UniversalCreditAfterRedundancyPage = createSeoCalculatorPage("claiming-universal-credit-after-redundancy");
const UniversalCreditAfterRedundancyShortPage = createSeoCalculatorPage("universal-credit-after-redundancy");
const RedundancyPayAffectUniversalCreditPage = createSeoCalculatorPage("does-redundancy-pay-affect-universal-credit");
const RedundancyPayAndBenefitsPage = createSeoCalculatorPage("redundancy-pay-and-benefits");
const ClaimJsaAfterRedundancyPage = createSeoCalculatorPage("can-i-claim-jsa-after-redundancy");
const RedundancyPaySavingsBenefitsPage = createSeoCalculatorPage("redundancy-pay-and-savings-benefits");
const EmployerInsolventRedundancyPayPage = createSeoCalculatorPage("employer-insolvent-redundancy-pay");
const RedundancyPaymentsServiceClaimPage = createSeoCalculatorPage("redundancy-payments-service-claim");
const EmployerHasNotPaidRedundancyPage = createSeoCalculatorPage("employer-has-not-paid-redundancy");
const ClaimRedundancyPayFromGovernmentPage = createSeoCalculatorPage("claim-redundancy-pay-from-government");
const UnpaidWagesRedundancyPage = createSeoCalculatorPage("unpaid-wages-redundancy");
const HolidayPayOwedAfterRedundancyPage = createSeoCalculatorPage("holiday-pay-owed-after-redundancy");
const RedundancyPayOver40Page = createSeoCalculatorPage("redundancy-pay-over-40");
const RedundancyPayAfter5YearsPage = createSeoCalculatorPage("redundancy-pay-after-5-years");
const RedundancyPayAfter10YearsPage = createSeoCalculatorPage("redundancy-pay-after-10-years");
const RedundancyPayAfter20YearsPage = createSeoCalculatorPage("redundancy-pay-after-20-years");
const PartTimeRedundancyPayCalculatorPage = createSeoCalculatorPage("part-time-redundancy-pay-calculator");
const ZeroHoursRedundancyPayCalculatorPage = createSeoCalculatorPage("zero-hours-redundancy-pay-calculator");
const FixedTermContractRedundancyPayPage = createSeoCalculatorPage("fixed-term-contract-redundancy-pay");
const RedundancyPayOver50Page = createSeoCalculatorPage("redundancy-pay-over-50");
const RedundancyPayOver60Page = createSeoCalculatorPage("redundancy-pay-over-60");
const RedundancyPayLessThan2YearsPage = createSeoCalculatorPage("redundancy-pay-less-than-2-years-service");
const AiJobUncertaintyPlanningPage = createSeoCalculatorPage("ai-job-uncertainty-financial-planning");
const RedundancyEntitlementCalculatorPage = createSeoCalculatorPage("redundancy-entitlement-calculator");
const TaxFreeRedundancyPayCalculatorPage = createSeoCalculatorPage("tax-free-redundancy-pay-calculator");
const RedundancyPay30000TaxFreePage = createSeoCalculatorPage("redundancy-pay-30000-tax-free");
const PilonAndRedundancyPayCalculatorPage = createSeoCalculatorPage("pilon-and-redundancy-pay-calculator");
const RedundancyPayNoticePayHolidayPayPage = createSeoCalculatorPage("redundancy-pay-notice-pay-holiday-pay");
const RedundancyLumpSumCalculatorPage = createSeoCalculatorPage("redundancy-lump-sum-calculator");
const RedundancyOfferCalculatorPage = createSeoCalculatorPage("redundancy-offer-calculator");
const EnhancedRedundancyOfferCalculatorPage = createSeoCalculatorPage("enhanced-redundancy-offer-calculator");
const VoluntaryRedundancyOfferCalculatorPage = createSeoCalculatorPage("voluntary-redundancy-offer-calculator");
const RedundancyFinalSalaryCalculatorPage = createSeoCalculatorPage("redundancy-final-salary-calculator");
const WhatShouldMyRedundancyPackageIncludePage = createSeoCalculatorPage("what-should-my-redundancy-package-include");
const RedundancyPackageChecklistPage = createSeoCalculatorPage("redundancy-package-checklist");
const HowMuchRedundancyPayAmIEntitledToPage = createSeoCalculatorPage("how-much-redundancy-pay-am-i-entitled-to");
const WhatRedundancyPayAmIEntitledToPage = createSeoCalculatorPage("what-redundancy-pay-am-i-entitled-to");
const IsMyRedundancyPackageFairPage = createSeoCalculatorPage("is-my-redundancy-package-fair");
const CanINegotiateRedundancyPayPage = createSeoCalculatorPage("can-i-negotiate-redundancy-pay");
const RedundancySettlementAgreementCalculatorPage = createSeoCalculatorPage("redundancy-settlement-agreement-calculator");

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/wizard" component={WizardPage} />
      <Route path="/preview" component={PreviewPage} />
      <Route path="/results" component={ResultsPage} />
      <Route path="/unlock" component={UnlockPage} />
      <Route path="/payment-success" component={PaymentSuccessPage} />
      <Route path="/access" component={AccessPage} />
      <Route path="/recover" component={AccessRecoveryPage} />
      <Route path="/report-access/:sessionToken" component={ReportAccessPage} />
      <Route path="/redundancy-reset/portal/:portalToken" component={RedundancyResetPortalPage} />
      <Route path="/redundancy-reset" component={RedundancyResetPage} />
      <Route path="/redundancy-reset/intake" component={RedundancyResetIntakePage} />
      <Route path="/admin/resets" component={AdminResetsPage} />
      <Route path="/free-redundancy-calculator" component={FreeRedundancyCalculatorPage} />
      <Route path="/redundancy-pay-calculator-uk" component={RedundancyPayCalculatorUkPage} />
      <Route path="/statutory-redundancy-pay-calculator" component={StatutoryRedundancyPayCalculatorPage} />
      <Route path="/redundancy-calculator-uk" component={RedundancyCalculatorUkPage} />
      <Route path="/redundancy-pay-calculator-2026" component={RedundancyPayCalculator2026Page} />
      <Route path="/how-much-redundancy-pay-will-i-get" component={HowMuchRedundancyPayPage} />
      <Route path="/how-does-redundancy-pay-work" component={HowDoesRedundancyPayWorkPage} />
      <Route path="/maximum-redundancy-pay-uk" component={MaximumRedundancyPayUkPage} />
      <Route path="/redundancy-package-calculator" component={RedundancyPackageCalculatorPage} />
      <Route path="/enhanced-redundancy-calculator" component={EnhancedRedundancyCalculatorPage} />
      <Route path="/voluntary-redundancy-calculator" component={VoluntaryRedundancyCalculatorPage} />
      <Route path="/redundancy-tax-calculator" component={RedundancyTaxCalculatorPage} />
      <Route path="/redundancy-pay-after-tax-calculator" component={RedundancyPayAfterTaxCalculatorPage} />
      <Route path="/redundancy-notice-pay-calculator" component={RedundancyNoticePayCalculatorPage} />
      <Route path="/pilon-calculator-redundancy" component={PilonCalculatorRedundancyPage} />
      <Route path="/holiday-pay-redundancy-calculator" component={HolidayPayRedundancyCalculatorPage} />
      <Route path="/redundancy-final-pay-calculator" component={RedundancyFinalPayCalculatorPage} />
      <Route path="/redundancy-payout-calculator" component={RedundancyPayoutCalculatorPage} />
      <Route path="/how-long-will-my-redundancy-pay-last" component={HowLongWillRedundancyPayLastPage} />
      <Route path="/how-long-will-my-savings-last-after-redundancy" component={HowLongWillSavingsLastAfterRedundancyPage} />
      <Route path="/redundancy-runway-calculator" component={RedundancyRunwayCalculatorPage} />
      <Route path="/income-loss-calculator-uk" component={IncomeLossCalculatorUkPage} />
      <Route path="/emergency-fund-runway-calculator" component={EmergencyFundRunwayCalculatorPage} />
      <Route path="/mortgage-redundancy-calculator" component={MortgageRedundancyCalculatorPage} />
      <Route path="/redundancy-and-mortgage-payments" component={RedundancyAndMortgagePaymentsPage} />
      <Route path="/one-income-household-calculator" component={OneIncomeHouseholdCalculatorPage} />
      <Route path="/redundancy-budget-calculator" component={RedundancyBudgetCalculatorPage} />
      <Route path="/job-loss-calculator-uk" component={JobLossCalculatorUkPage} />
      <Route path="/at-risk-of-redundancy-what-to-do" component={AtRiskOfRedundancyWhatToDoPage} />
      <Route path="/made-redundant-what-next" component={MadeRedundantWhatNextPage} />
      <Route path="/first-week-after-redundancy" component={FirstWeekAfterRedundancyPage} />
      <Route path="/redundancy-action-plan" component={RedundancyActionPlanPage} />
      <Route path="/redundancy-consultation-questions" component={RedundancyConsultationQuestionsPage} />
      <Route path="/questions-to-ask-in-redundancy-consultation" component={QuestionsToAskInRedundancyConsultationPage} />
      <Route path="/what-to-do-before-redundancy-consultation" component={WhatToDoBeforeRedundancyConsultationPage} />
      <Route path="/worried-about-losing-your-job" component={WorriedAboutLosingYourJobPage} />
      <Route path="/my-job-is-at-risk-what-should-i-do" component={MyJobIsAtRiskPage} />
      <Route path="/redundancy-next-steps" component={RedundancyNextStepsPage} />
      <Route path="/redundancy-rights-uk" component={RedundancyRightsUkPage} />
      <Route path="/benefits-after-redundancy" component={BenefitsAfterRedundancyPage} />
      <Route path="/claiming-universal-credit-after-redundancy" component={UniversalCreditAfterRedundancyPage} />
      <Route path="/universal-credit-after-redundancy" component={UniversalCreditAfterRedundancyShortPage} />
      <Route path="/does-redundancy-pay-affect-universal-credit" component={RedundancyPayAffectUniversalCreditPage} />
      <Route path="/redundancy-pay-and-benefits" component={RedundancyPayAndBenefitsPage} />
      <Route path="/can-i-claim-jsa-after-redundancy" component={ClaimJsaAfterRedundancyPage} />
      <Route path="/redundancy-pay-and-savings-benefits" component={RedundancyPaySavingsBenefitsPage} />
      <Route path="/employer-insolvent-redundancy-pay" component={EmployerInsolventRedundancyPayPage} />
      <Route path="/redundancy-payments-service-claim" component={RedundancyPaymentsServiceClaimPage} />
      <Route path="/employer-has-not-paid-redundancy" component={EmployerHasNotPaidRedundancyPage} />
      <Route path="/claim-redundancy-pay-from-government" component={ClaimRedundancyPayFromGovernmentPage} />
      <Route path="/unpaid-wages-redundancy" component={UnpaidWagesRedundancyPage} />
      <Route path="/holiday-pay-owed-after-redundancy" component={HolidayPayOwedAfterRedundancyPage} />
      <Route path="/redundancy-pay-over-40" component={RedundancyPayOver40Page} />
      <Route path="/redundancy-pay-after-5-years" component={RedundancyPayAfter5YearsPage} />
      <Route path="/redundancy-pay-after-10-years" component={RedundancyPayAfter10YearsPage} />
      <Route path="/redundancy-pay-after-20-years" component={RedundancyPayAfter20YearsPage} />
      <Route path="/part-time-redundancy-pay-calculator" component={PartTimeRedundancyPayCalculatorPage} />
      <Route path="/zero-hours-redundancy-pay-calculator" component={ZeroHoursRedundancyPayCalculatorPage} />
      <Route path="/fixed-term-contract-redundancy-pay" component={FixedTermContractRedundancyPayPage} />
      <Route path="/redundancy-pay-over-50" component={RedundancyPayOver50Page} />
      <Route path="/redundancy-pay-over-60" component={RedundancyPayOver60Page} />
      <Route path="/redundancy-pay-less-than-2-years-service" component={RedundancyPayLessThan2YearsPage} />
      <Route path="/ai-job-uncertainty-financial-planning" component={AiJobUncertaintyPlanningPage} />
      <Route path="/redundancy-entitlement-calculator" component={RedundancyEntitlementCalculatorPage} />
      <Route path="/tax-free-redundancy-pay-calculator" component={TaxFreeRedundancyPayCalculatorPage} />
      <Route path="/redundancy-pay-30000-tax-free" component={RedundancyPay30000TaxFreePage} />
      <Route path="/pilon-and-redundancy-pay-calculator" component={PilonAndRedundancyPayCalculatorPage} />
      <Route path="/redundancy-pay-notice-pay-holiday-pay" component={RedundancyPayNoticePayHolidayPayPage} />
      <Route path="/redundancy-lump-sum-calculator" component={RedundancyLumpSumCalculatorPage} />
      <Route path="/redundancy-offer-calculator" component={RedundancyOfferCalculatorPage} />
      <Route path="/enhanced-redundancy-offer-calculator" component={EnhancedRedundancyOfferCalculatorPage} />
      <Route path="/voluntary-redundancy-offer-calculator" component={VoluntaryRedundancyOfferCalculatorPage} />
      <Route path="/redundancy-final-salary-calculator" component={RedundancyFinalSalaryCalculatorPage} />
      <Route path="/what-should-my-redundancy-package-include" component={WhatShouldMyRedundancyPackageIncludePage} />
      <Route path="/redundancy-package-checklist" component={RedundancyPackageChecklistPage} />
      <Route path="/how-much-redundancy-pay-am-i-entitled-to" component={HowMuchRedundancyPayAmIEntitledToPage} />
      <Route path="/what-redundancy-pay-am-i-entitled-to" component={WhatRedundancyPayAmIEntitledToPage} />
      <Route path="/is-my-redundancy-package-fair" component={IsMyRedundancyPackageFairPage} />
      <Route path="/can-i-negotiate-redundancy-pay" component={CanINegotiateRedundancyPayPage} />
      <Route path="/redundancy-settlement-agreement-calculator" component={RedundancySettlementAgreementCalculatorPage} />
      <Route path="/statutory-redundancy-pay" component={StatutoryRedundancyPayCalculatorPage} />
      <Route path="/redundancy-mortgage" component={RedundancyMortgagePage} />
      <Route path="/voluntary-redundancy" component={VoluntaryRedundancyCalculatorPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/brief-example" component={BriefExamplePage} />
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
