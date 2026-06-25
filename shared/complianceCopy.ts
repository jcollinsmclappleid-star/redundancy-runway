/** Standard non-advisory disclaimer for dashboards and reports. */
export const DASHBOARD_DISCLAIMER =
  "RedundancyCalculatorUK is an assumption-based modelling tool. It does not provide financial, legal, tax, debt, benefits, mortgage or employment advice and does not predict employment outcomes.";

export const PACKAGE_DISCLAIMER =
  "Figures are estimates based on the assumptions entered. This does not decide legal entitlement, fairness of an offer, or personal tax treatment.";

export const TAX_SENSITIVE_DISCLAIMER =
  "This section separates package components for modelling clarity. It is not tax advice. Check treatment with payroll, HMRC guidance or a qualified tax professional.";

export const OFFER_COMPARISON_DISCLAIMER =
  "This comparison shows how the employer or manual package entered differs from the statutory estimate under your assumptions. It does not assess whether an offer is fair or provide employment advice.";

export const COMPLETENESS_DISCLAIMER =
  "Package completeness shows how much of the package model has been filled in. It does not assess whether an offer is fair, correct or legally complete.";

export const FREE_STATUTORY_BOUNDARY =
  "This is an estimate only. It does not decide legal entitlement or include every possible package component.";

export const WIDER_PACKAGE_TEASER =
  "Statutory redundancy may be only part of the picture. Your final package may also include enhanced redundancy, notice pay or PILON, accrued holiday pay, unpaid wages, bonus or commission, and other employer payments.";

/** Safer positioning phrases for package UI copy. */
export const ALLOWED_PACKAGE_PHRASES = [
  "package checks",
  "figures to verify",
  "package completeness",
  "what could be included",
  "what may need checking",
  "under the assumptions entered",
  "model your package",
  "estimated statutory redundancy",
] as const;

/** Phrases that must not appear next to calculated currency amounts in UI. */
export const BLOCKED_RESULT_PHRASES = [
  "you are entitled to",
  "you are owed",
  "you should ask for",
  "maximise your payout",
  "maximize your payout",
  "get more money",
  "guaranteed",
  "what you are owed",
  "negotiate a better",
  "what to demand",
  "best option",
] as const;

/** Safe verification questions — not negotiation prompts. */
export const PACKAGE_VERIFY_QUESTIONS = [
  "Has the employer separated statutory redundancy from notice pay or PILON?",
  "Has accrued holiday pay been listed separately?",
  "Is the employer or manual package figure gross or net?",
  "Is the payment date clear?",
  "Are deductions explained?",
  "Are any settlement agreement requirements clearly stated?",
  "Which figures should be checked against payslips, contract or HR documentation?",
] as const;
