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
  "maximise your package understanding",
  "could increase the total",
  "prepare stronger questions",
  "protect your planning position",
  "reduce avoidable mistakes",
  "model better outcomes",
  "strengthen your consultation preparation",
  "understand what could improve the picture",
] as const;

export const POSITION_ENHANCEMENT_DISCLAIMER =
  "These tools help you check package assumptions, model scenarios and prepare questions. They do not provide legal or employment advice, do not assess fairness or entitlement, and do not guarantee outcomes.";

export const PAYOUT_SCENARIO_DISCLAIMER =
  "These are modelling scenarios only. They do not say what your employer will offer or what you are entitled to.";

export const CONSULTATION_PACK_DISCLAIMER =
  "This pack helps you prepare for consultation. It is not legal or employment advice and does not assess whether the process is fair.";

export const ROLE_PROTECTION_DISCLAIMER =
  "These actions cannot guarantee an outcome, but they can improve your preparation before consultation or redeployment conversations.";

export const SELECTION_CRITERIA_DISCLAIMER =
  "This does not assess whether selection criteria are fair. It helps organise evidence for discussion.";

export const ALTERNATIVE_ROLE_DISCLAIMER =
  "This module helps organise redeployment questions. It does not assess legal suitability or recommend whether to accept a role.";

export const EMAIL_TEMPLATE_DISCLAIMER =
  "Templates are for clarification and preparation only. They are not legal, employment or negotiation advice.";

export const LEVERAGE_MAP_DISCLAIMER =
  "This map shows where better information, preparation or scenarios could improve your planning position. It does not tell you what decision to make.";

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
