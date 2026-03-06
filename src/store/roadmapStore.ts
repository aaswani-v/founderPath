import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Roadmap,
  RiskScore,
  StartupProfile,
  PhaseStatus,
  ExpansionProfile,
} from '../models';
import { decisionEngine } from '../services/decisionEngine';

const STORAGE_KEY = 'founderpath-roadmap';

interface RoadmapState {
  roadmap: Roadmap | null;
  riskScores: RiskScore | null;
  startupProfile: StartupProfile | null;
  expansionProfile: ExpansionProfile | null;
  isExpansionMode: boolean;
  _hydrated: boolean;
  hydrate: () => Promise<void>;
  generateRoadmap: (profile: StartupProfile) => void;
  updateTaskStatus: (phaseId: string, taskId: string, status: PhaseStatus) => void;
  setExpansionMode: (enabled: boolean) => void;
  setExpansionProfile: (profile: ExpansionProfile) => void;
  resetRoadmap: () => void;
}

// Helper to save roadmap data to AsyncStorage
const persistState = (state: Partial<RoadmapState>) => {
  const { roadmap, riskScores, startupProfile, expansionProfile, isExpansionMode } = state as RoadmapState;
  AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ roadmap, riskScores, startupProfile, expansionProfile, isExpansionMode })
  ).catch((e) => console.warn('Failed to persist roadmap state:', e));
};

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  roadmap: null,
  riskScores: null,
  startupProfile: null,
  expansionProfile: null,
  isExpansionMode: false,
  _hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({
          roadmap: parsed.roadmap ?? null,
          riskScores: parsed.riskScores ?? null,
          startupProfile: parsed.startupProfile ?? null,
          expansionProfile: parsed.expansionProfile ?? null,
          isExpansionMode: parsed.isExpansionMode ?? false,
          _hydrated: true,
        });
      } else {
        set({ _hydrated: true });
      }
    } catch {
      set({ _hydrated: true });
    }
  },

  generateRoadmap: (profile) => {
    const roadmap = decisionEngine.generateRoadmap(profile);
    const riskScores = decisionEngine.computeRiskScores(profile);
    set({ roadmap, riskScores, startupProfile: profile });
    persistState({ ...get(), roadmap, riskScores, startupProfile: profile });
  },

  updateTaskStatus: (phaseId, taskId, status) => {
    const { roadmap } = get();
    if (!roadmap) return;

    const now = new Date().toISOString();

    const updatedPhases = roadmap.phases.map((phase) => {
      if (phase.id !== phaseId) return phase;

      const updatedTasks = phase.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status, completedAt: status === 'completed' ? now : undefined }
          : task
      );

      const completedCount = updatedTasks.filter(
        (t) => t.status === 'completed'
      ).length;
      const completionPercentage = Math.round(
        (completedCount / updatedTasks.length) * 100
      );

      const allCompleted = updatedTasks.every((t) => t.status === 'completed');
      const anyInProgress = updatedTasks.some((t) => t.status === 'in_progress');

      let phaseStatus: PhaseStatus = 'pending';
      if (allCompleted) phaseStatus = 'completed';
      else if (anyInProgress || completedCount > 0) phaseStatus = 'in_progress';

      return {
        ...phase,
        tasks: updatedTasks,
        completionPercentage,
        status: phaseStatus,
        startedAt: phase.startedAt || (anyInProgress || completedCount > 0 ? now : undefined),
      };
    });

    // Dynamic timeline: if a phase just completed, shorten future pending phases
    const justCompletedPhaseIdx = updatedPhases.findIndex(
      (p) => p.id === phaseId && p.status === 'completed'
    );
    if (justCompletedPhaseIdx >= 0 && status === 'completed') {
      const completedPhase = updatedPhases[justCompletedPhaseIdx];
      const estDays = parseEstimatedDays(completedPhase.estimatedTimeline);
      const startDate = completedPhase.startedAt ? new Date(completedPhase.startedAt) : null;
      if (startDate && estDays > 0) {
        const actualDays = Math.max(1, Math.round((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const savedRatio = Math.max(0, Math.min(1, actualDays / estDays));
        if (savedRatio < 1) {
          // Speed up future pending phases proportionally
          for (let i = justCompletedPhaseIdx + 1; i < updatedPhases.length; i++) {
            if (updatedPhases[i].status === 'pending') {
              const futureDays = parseEstimatedDays(updatedPhases[i].estimatedTimeline);
              if (futureDays > 0) {
                const adjusted = Math.max(1, Math.round(futureDays * savedRatio));
                updatedPhases[i] = {
                  ...updatedPhases[i],
                  estimatedTimeline: formatDays(adjusted),
                };
              }
            }
          }
        }
      }
    }

    const updatedRoadmap = {
      ...roadmap,
      phases: updatedPhases,
      lastUpdated: now,
    };

    set({ roadmap: updatedRoadmap });
    persistState({ ...get(), roadmap: updatedRoadmap });
  },

  setExpansionMode: (enabled) => {
    set({ isExpansionMode: enabled });
    persistState({ ...get(), isExpansionMode: enabled });
  },

  setExpansionProfile: (profile) => {
    set({ expansionProfile: profile });
    persistState({ ...get(), expansionProfile: profile });
  },

  resetRoadmap: () => {
    set({
      roadmap: null,
      riskScores: null,
      startupProfile: null,
      expansionProfile: null,
      isExpansionMode: false,
    });
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  },
}));

/* ── Helper: parse "1–2 weeks" / "2 weeks" / "3–4 months" into days ── */
function parseEstimatedDays(timeline: string): number {
  const lower = timeline.toLowerCase();
  const nums = lower.match(/\d+/g);
  if (!nums) return 0;
  const avg = nums.reduce((a, b) => a + Number(b), 0) / nums.length;
  if (lower.includes('month')) return Math.round(avg * 30);
  if (lower.includes('week')) return Math.round(avg * 7);
  if (lower.includes('day')) return Math.round(avg);
  return Math.round(avg * 7); // default to weeks
}

function formatDays(days: number): string {
  if (days >= 28) {
    const months = Math.round(days / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  const weeks = Math.round(days / 7);
  return weeks < 1 ? '< 1 week' : `${weeks} week${weeks > 1 ? 's' : ''}`;
}
