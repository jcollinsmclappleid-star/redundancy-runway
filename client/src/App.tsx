import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
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
import { createAiRedundancySeoPage } from "@/pages/seo/ai-redundancy-pages";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import LegalPage from "@/pages/legal";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import MethodologyPage from "@/pages/methodology";
import BriefExamplePage from "@/pages/brief-example";
import ReportExamplePage from "@/pages/report-example";

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
const UnpaidWagesAfterRedundancyPage = createSeoCalculatorPage("unpaid-wages-after-redundancy");
const BonusCommissionRedundancyPayPage = createSeoCalculatorPage("bonus-commission-redundancy-pay");
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
const RedundancyReadinessCalculatorPage = createSeoCalculatorPage("redundancy-readiness-calculator");
const AtRiskOfRedundancyCalculatorPage = createSeoCalculatorPage("at-risk-of-redundancy-calculator");
const AtRiskOfRedundancyWhatToDoPage = createSeoCalculatorPage("at-risk-of-redundancy-what-to-do");
const RedundancyConsultationDefencePackPage = createSeoCalculatorPage("redundancy-consultation-defence-pack");
const HowToPrepareForRedundancyConsultationPage = createSeoCalculatorPage("how-to-prepare-for-redundancy-consultation");
const MadeRedundantWhatNextPage = createSeoCalculatorPage("made-redundant-what-next");
const FirstWeekAfterRedundancyPage = createSeoCalculatorPage("first-week-after-redundancy");
const RedundancyActionPlanPage = createSeoCalculatorPage("redundancy-action-plan");
const RedundancyConsultationQuestionsPage = createSeoCalculatorPage("redundancy-consultation-questions");
const QuestionsToAskInRedundancyConsultationPage = createSeoCalculatorPage("questions-to-ask-in-redundancy-consultation");
const WhatToDoBeforeRedundancyConsultationPage = createSeoCalculatorPage("what-to-do-before-redundancy-consultation");
const RedundancyConsultationPreparationPage = createSeoCalculatorPage("redundancy-consultation-preparation");
const RedundancyConsultationChecklistPage = createSeoCalculatorPage("redundancy-consultation-checklist");
const WorriedAboutLosingYourJobPage = createSeoCalculatorPage("worried-about-losing-your-job");
const HowToProtectYourselfDuringRedundancyConsultationPage = createSeoCalculatorPage("how-to-protect-yourself-during-redundancy-consultation");
const WorriedAboutRedundancyPage = createSeoCalculatorPage("worried-about-redundancy");
const HowToAvoidBeingSelectedForRedundancyPage = createSeoCalculatorPage("how-to-avoid-being-selected-for-redundancy");
const RedundancySelectionCriteriaPage = createSeoCalculatorPage("redundancy-selection-criteria");
const RedundancySelectionScorePage = createSeoCalculatorPage("redundancy-selection-score");
const RedundancySelectionMatrixPage = createSeoCalculatorPage("redundancy-selection-matrix");
const HowToChallengeRedundancySelectionPage = createSeoCalculatorPage("how-to-challenge-redundancy-selection");
const RedundancySelectionCriteriaExamplesPage = createSeoCalculatorPage("redundancy-selection-criteria-examples");
const WhatEvidenceToPrepareForRedundancyConsultationPage = createSeoCalculatorPage("what-evidence-to-prepare-for-redundancy-consultation");
const RedundancyPerformanceSelectionCriteriaPage = createSeoCalculatorPage("redundancy-performance-selection-criteria");
const RedundancySkillsSelectionCriteriaPage = createSeoCalculatorPage("redundancy-skills-selection-criteria");
const RedundancyAttendanceSelectionCriteriaPage = createSeoCalculatorPage("redundancy-attendance-selection-criteria");
const SuitableAlternativeEmploymentRedundancyPage = createSeoCalculatorPage("suitable-alternative-employment-redundancy");
const AlternativeRoleRedundancyPage = createSeoCalculatorPage("alternative-role-redundancy");
const RedeploymentRedundancyPage = createSeoCalculatorPage("redeployment-redundancy");
const RedundancyAlternativeEmploymentQuestionsPage = createSeoCalculatorPage("redundancy-alternative-employment-questions");
const InternalVacanciesRedundancyPage = createSeoCalculatorPage("internal-vacancies-redundancy");
const RedundancyTrialPeriodAlternativeRolePage = createSeoCalculatorPage("redundancy-trial-period-alternative-role");
const RefusingSuitableAlternativeEmploymentPage = createSeoCalculatorPage("refusing-suitable-alternative-employment");
const RedundancyRedeploymentChecklistPage = createSeoCalculatorPage("redundancy-redeployment-checklist");
const RedundancyRoleProtectionPlannerPage = createSeoCalculatorPage("redundancy-role-protection-planner");
const HowToFindAlternativeRoleDuringRedundancyPage = createSeoCalculatorPage("how-to-find-alternative-role-during-redundancy");
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
const AmIEntitledToRedundancyPayPage = createSeoCalculatorPage("am-i-entitled-to-redundancy-pay");
const TaxFreeRedundancyPayCalculatorPage = createSeoCalculatorPage("tax-free-redundancy-pay-calculator");
const RedundancyPay30000TaxFreePage = createSeoCalculatorPage("redundancy-pay-30000-tax-free");
const PilonAndRedundancyPayCalculatorPage = createSeoCalculatorPage("pilon-and-redundancy-pay-calculator");
const RedundancyPayNoticePayHolidayPayPage = createSeoCalculatorPage("redundancy-pay-notice-pay-holiday-pay");
const RedundancyPaymentDatePage = createSeoCalculatorPage("redundancy-payment-date");
const RedundancyLumpSumCalculatorPage = createSeoCalculatorPage("redundancy-lump-sum-calculator");
const HowToGetMoreRedundancyPayPage = createSeoCalculatorPage("how-to-get-more-redundancy-pay");
const MaximiseRedundancyPackagePage = createSeoCalculatorPage("maximise-redundancy-package");
const MissingRedundancyPaymentsChecklistPage = createSeoCalculatorPage("missing-redundancy-payments-checklist");
const RedundancyPackageMaximiserPage = createSeoCalculatorPage("redundancy-package-maximiser");
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

const AiRedundancyCalculatorPage = createAiRedundancySeoPage("ai-redundancy-calculator");
const WillAiReplaceMyJobPage = createAiRedundancySeoPage("will-ai-replace-my-job");
const CanMyEmployerReplaceMeWithAiPage = createAiRedundancySeoPage("can-my-employer-replace-me-with-ai");
const WhatJobsWillAiReplacePage = createAiRedundancySeoPage("what-jobs-will-ai-replace");
const HowToProtectYourJobFromAiPage = createAiRedundancySeoPage("how-to-protect-your-job-from-ai");
const AiJobRiskCalculatorPage = createAiRedundancySeoPage("ai-job-risk-calculator");
const JobsMostAtRiskFromAiPage = createAiRedundancySeoPage("jobs-most-at-risk-from-ai");
const JobsSafeFromAiPage = createAiRedundancySeoPage("jobs-safe-from-ai");
const AiRedundancyRightsUkPage = createAiRedundancySeoPage("ai-redundancy-rights-uk");
const AiProofYourCareerPage = createAiRedundancySeoPage("ai-proof-your-career");

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
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
      <Route path="/unpaid-wages-after-redundancy" component={UnpaidWagesAfterRedundancyPage} />
      <Route path="/bonus-commission-redundancy-pay" component={BonusCommissionRedundancyPayPage} />
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
      <Route path="/redundancy-readiness-calculator" component={RedundancyReadinessCalculatorPage} />
      <Route path="/at-risk-of-redundancy-calculator" component={AtRiskOfRedundancyCalculatorPage} />
      <Route path="/at-risk-of-redundancy-what-to-do" component={AtRiskOfRedundancyWhatToDoPage} />
      <Route path="/redundancy-consultation-defence-pack" component={RedundancyConsultationDefencePackPage} />
      <Route path="/how-to-prepare-for-redundancy-consultation" component={HowToPrepareForRedundancyConsultationPage} />
      <Route path="/made-redundant-what-next" component={MadeRedundantWhatNextPage} />
      <Route path="/first-week-after-redundancy" component={FirstWeekAfterRedundancyPage} />
      <Route path="/redundancy-action-plan" component={RedundancyActionPlanPage} />
      <Route path="/redundancy-consultation-questions" component={RedundancyConsultationQuestionsPage} />
      <Route path="/questions-to-ask-in-redundancy-consultation" component={QuestionsToAskInRedundancyConsultationPage} />
      <Route path="/what-to-do-before-redundancy-consultation" component={WhatToDoBeforeRedundancyConsultationPage} />
      <Route path="/redundancy-consultation-preparation" component={RedundancyConsultationPreparationPage} />
      <Route path="/redundancy-consultation-checklist" component={RedundancyConsultationChecklistPage} />
      <Route path="/worried-about-losing-your-job" component={WorriedAboutLosingYourJobPage} />
      <Route path="/how-to-protect-yourself-during-redundancy-consultation" component={HowToProtectYourselfDuringRedundancyConsultationPage} />
      <Route path="/worried-about-redundancy" component={WorriedAboutRedundancyPage} />
      <Route path="/how-to-avoid-being-selected-for-redundancy" component={HowToAvoidBeingSelectedForRedundancyPage} />
      <Route path="/redundancy-selection-criteria" component={RedundancySelectionCriteriaPage} />
      <Route path="/redundancy-selection-score" component={RedundancySelectionScorePage} />
      <Route path="/redundancy-selection-matrix" component={RedundancySelectionMatrixPage} />
      <Route path="/how-to-challenge-redundancy-selection" component={HowToChallengeRedundancySelectionPage} />
      <Route path="/redundancy-selection-criteria-examples" component={RedundancySelectionCriteriaExamplesPage} />
      <Route path="/what-evidence-to-prepare-for-redundancy-consultation" component={WhatEvidenceToPrepareForRedundancyConsultationPage} />
      <Route path="/redundancy-performance-selection-criteria" component={RedundancyPerformanceSelectionCriteriaPage} />
      <Route path="/redundancy-skills-selection-criteria" component={RedundancySkillsSelectionCriteriaPage} />
      <Route path="/redundancy-attendance-selection-criteria" component={RedundancyAttendanceSelectionCriteriaPage} />
      <Route path="/suitable-alternative-employment-redundancy" component={SuitableAlternativeEmploymentRedundancyPage} />
      <Route path="/alternative-role-redundancy" component={AlternativeRoleRedundancyPage} />
      <Route path="/redeployment-redundancy" component={RedeploymentRedundancyPage} />
      <Route path="/redundancy-alternative-employment-questions" component={RedundancyAlternativeEmploymentQuestionsPage} />
      <Route path="/internal-vacancies-redundancy" component={InternalVacanciesRedundancyPage} />
      <Route path="/redundancy-trial-period-alternative-role" component={RedundancyTrialPeriodAlternativeRolePage} />
      <Route path="/refusing-suitable-alternative-employment" component={RefusingSuitableAlternativeEmploymentPage} />
      <Route path="/redundancy-redeployment-checklist" component={RedundancyRedeploymentChecklistPage} />
      <Route path="/redundancy-role-protection-planner" component={RedundancyRoleProtectionPlannerPage} />
      <Route path="/how-to-find-alternative-role-during-redundancy" component={HowToFindAlternativeRoleDuringRedundancyPage} />
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
      <Route path="/am-i-entitled-to-redundancy-pay" component={AmIEntitledToRedundancyPayPage} />
      <Route path="/tax-free-redundancy-pay-calculator" component={TaxFreeRedundancyPayCalculatorPage} />
      <Route path="/redundancy-pay-30000-tax-free" component={RedundancyPay30000TaxFreePage} />
      <Route path="/pilon-and-redundancy-pay-calculator" component={PilonAndRedundancyPayCalculatorPage} />
      <Route path="/redundancy-pay-notice-pay-holiday-pay" component={RedundancyPayNoticePayHolidayPayPage} />
      <Route path="/redundancy-payment-date" component={RedundancyPaymentDatePage} />
      <Route path="/redundancy-lump-sum-calculator" component={RedundancyLumpSumCalculatorPage} />
      <Route path="/how-to-get-more-redundancy-pay" component={HowToGetMoreRedundancyPayPage} />
      <Route path="/maximise-redundancy-package" component={MaximiseRedundancyPackagePage} />
      <Route path="/missing-redundancy-payments-checklist" component={MissingRedundancyPaymentsChecklistPage} />
      <Route path="/redundancy-package-maximiser" component={RedundancyPackageMaximiserPage} />
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
      <Route path="/ai-redundancy-calculator" component={AiRedundancyCalculatorPage} />
      <Route path="/will-ai-replace-my-job" component={WillAiReplaceMyJobPage} />
      <Route path="/can-my-employer-replace-me-with-ai" component={CanMyEmployerReplaceMeWithAiPage} />
      <Route path="/what-jobs-will-ai-replace" component={WhatJobsWillAiReplacePage} />
      <Route path="/how-to-protect-your-job-from-ai" component={HowToProtectYourJobFromAiPage} />
      <Route path="/ai-job-risk-calculator" component={AiJobRiskCalculatorPage} />
      <Route path="/jobs-most-at-risk-from-ai" component={JobsMostAtRiskFromAiPage} />
      <Route path="/jobs-safe-from-ai" component={JobsSafeFromAiPage} />
      <Route path="/ai-redundancy-rights-uk" component={AiRedundancyRightsUkPage} />
      <Route path="/ai-proof-your-career" component={AiProofYourCareerPage} />
      <Route path="/redundancy-mortgage" component={RedundancyMortgagePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/legal" component={LegalPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/methodology" component={MethodologyPage} />
      <Route path="/brief-example" component={BriefExamplePage} />
      <Route path="/report-example" component={ReportExamplePage} />
      <Route component={NotFound} />
    </Switch>
    </>
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
