import { useState, useCallback } from "react";
import type { RunwayInputs } from "@shared/schema";

const defaultInputs: RunwayInputs = {
  cashSavings: 0,
  liquidInvestments: 0,
  redundancyPayout: 0,
  otherOneOffIncome: 0,
  currentMonthlyNetIncome: 0,
  replacementMonthlyIncome: 0,
  monthsUntilNewJob: 6,
  benefitSupportEstimate: 0,
  mortgageOrRent: 0,
  utilities: 0,
  food: 0,
  insurance: 0,
  transport: 0,
  debtRepayments: 0,
  childcare: 0,
  otherEssential: 0,
  subscriptions: 0,
  leisure: 0,
  travel: 0,
  discretionaryOther: 0,
  includeNonEssential: true,
  emergencyBuffer: 5000,
  sector: "all",
};

const STORAGE_KEY = "redundancy_runway_inputs";

function loadInputs(): RunwayInputs {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultInputs, ...parsed };
    }
  } catch {}
  return { ...defaultInputs };
}

function saveInputs(inputs: RunwayInputs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch {}
}

export function useWizardStore() {
  const [inputs, setInputsState] = useState<RunwayInputs>(loadInputs);
  const [step, setStep] = useState(0);

  const setInputs = useCallback((updater: Partial<RunwayInputs> | ((prev: RunwayInputs) => RunwayInputs)) => {
    setInputsState(prev => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      saveInputs(next);
      return next;
    });
  }, []);

  const resetInputs = useCallback(() => {
    setInputsState({ ...defaultInputs });
    saveInputs({ ...defaultInputs });
    setStep(0);
  }, []);

  return { inputs, setInputs, step, setStep, resetInputs };
}

export { defaultInputs };
