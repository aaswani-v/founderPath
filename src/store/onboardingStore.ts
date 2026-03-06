import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  OnboardingAnswer,
  FounderType,
  StartupType,
  GoalType,
  BudgetRange,
  MarketType,
} from '../models';

const STORAGE_KEY = 'founderpath-onboarding';

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  answers: OnboardingAnswer;
  isComplete: boolean;
  wasSkipped: boolean;
  _hydrated: boolean;
  hydrate: () => Promise<void>;
  setFounderType: (type: FounderType) => void;
  setStartupType: (type: StartupType) => void;
  setGoal: (goal: GoalType) => void;
  setBudgetRange: (range: BudgetRange) => void;
  setTechnicalBackground: (has: boolean) => void;
  setMarketType: (type: MarketType) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
  isProfileComplete: () => boolean;
}

// Helper to save state to AsyncStorage
const persistState = (state: Partial<OnboardingState>) => {
  const { answers, isComplete, wasSkipped, currentStep } = state as OnboardingState;
  AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ answers, isComplete, wasSkipped, currentStep })
  ).catch((e) => console.warn('Failed to persist onboarding state:', e));
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 0,
  totalSteps: 6,
  answers: {},
  isComplete: false,
  wasSkipped: false,
  _hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({
          answers: parsed.answers ?? {},
          isComplete: parsed.isComplete ?? false,
          wasSkipped: parsed.wasSkipped ?? false,
          currentStep: parsed.currentStep ?? 0,
          _hydrated: true,
        });
      } else {
        set({ _hydrated: true });
      }
    } catch {
      set({ _hydrated: true });
    }
  },

  setFounderType: (founderType) => {
    set((state) => {
      const next = { ...state, answers: { ...state.answers, founderType } };
      persistState(next);
      return { answers: next.answers };
    });
  },

  setStartupType: (startupType) => {
    set((state) => {
      const next = { ...state, answers: { ...state.answers, startupType } };
      persistState(next);
      return { answers: next.answers };
    });
  },

  setGoal: (goal) => {
    set((state) => {
      const next = { ...state, answers: { ...state.answers, goal } };
      persistState(next);
      return { answers: next.answers };
    });
  },

  setBudgetRange: (budgetRange) => {
    set((state) => {
      const next = { ...state, answers: { ...state.answers, budgetRange } };
      persistState(next);
      return { answers: next.answers };
    });
  },

  setTechnicalBackground: (hasTechnicalBackground) => {
    set((state) => {
      const next = { ...state, answers: { ...state.answers, hasTechnicalBackground } };
      persistState(next);
      return { answers: next.answers };
    });
  },

  setMarketType: (marketType) => {
    set((state) => {
      const next = { ...state, answers: { ...state.answers, marketType } };
      persistState(next);
      return { answers: next.answers };
    });
  },

  nextStep: () =>
    set((state) => {
      const next = { ...state, currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1) };
      persistState(next);
      return { currentStep: next.currentStep };
    }),

  prevStep: () =>
    set((state) => {
      const next = { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
      persistState(next);
      return { currentStep: next.currentStep };
    }),

  completeOnboarding: () => {
    set((state) => {
      const next = { ...state, isComplete: true };
      persistState(next);
      return { isComplete: true };
    });
  },

  skipOnboarding: () => {
    const skippedState = {
      isComplete: true,
      wasSkipped: true,
      answers: {
        founderType: 'student' as FounderType,
        startupType: 'saas' as StartupType,
        goal: 'build_mvp' as GoalType,
        budgetRange: 'low' as BudgetRange,
        hasTechnicalBackground: false,
        marketType: 'b2c' as MarketType,
      },
      currentStep: 0,
    };
    set(skippedState);
    persistState({ ...get(), ...skippedState });
  },

  resetOnboarding: () => {
    const resetState = { currentStep: 0, answers: {}, isComplete: false, wasSkipped: false };
    set(resetState);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  },

  isProfileComplete: () => {
    const { answers } = get();
    return !!(
      answers.founderType &&
      answers.startupType &&
      answers.goal &&
      answers.budgetRange &&
      answers.hasTechnicalBackground !== undefined &&
      answers.marketType
    );
  },
}));
