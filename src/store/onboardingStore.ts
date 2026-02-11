import { create } from 'zustand';
import {
  OnboardingAnswer,
  FounderType,
  StartupType,
  GoalType,
  BudgetRange,
  MarketType,
} from '../models';

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  answers: OnboardingAnswer;
  isComplete: boolean;
  setFounderType: (type: FounderType) => void;
  setStartupType: (type: StartupType) => void;
  setGoal: (goal: GoalType) => void;
  setBudgetRange: (range: BudgetRange) => void;
  setTechnicalBackground: (has: boolean) => void;
  setMarketType: (type: MarketType) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 0,
  totalSteps: 6,
  answers: {},
  isComplete: false,

  setFounderType: (founderType) =>
    set((state) => ({ answers: { ...state.answers, founderType } })),

  setStartupType: (startupType) =>
    set((state) => ({ answers: { ...state.answers, startupType } })),

  setGoal: (goal) =>
    set((state) => ({ answers: { ...state.answers, goal } })),

  setBudgetRange: (budgetRange) =>
    set((state) => ({ answers: { ...state.answers, budgetRange } })),

  setTechnicalBackground: (hasTechnicalBackground) =>
    set((state) => ({ answers: { ...state.answers, hasTechnicalBackground } })),

  setMarketType: (marketType) =>
    set((state) => ({ answers: { ...state.answers, marketType } })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  completeOnboarding: () => set({ isComplete: true }),

  resetOnboarding: () =>
    set({ currentStep: 0, answers: {}, isComplete: false }),
}));
