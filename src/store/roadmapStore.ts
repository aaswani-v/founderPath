import { create } from 'zustand';
import {
  Roadmap,
  RiskScore,
  StartupProfile,
  PhaseStatus,
  ExpansionProfile,
} from '../models';
import { decisionEngine } from '../services/decisionEngine';

interface RoadmapState {
  roadmap: Roadmap | null;
  riskScores: RiskScore | null;
  startupProfile: StartupProfile | null;
  expansionProfile: ExpansionProfile | null;
  isExpansionMode: boolean;
  generateRoadmap: (profile: StartupProfile) => void;
  updateTaskStatus: (phaseId: string, taskId: string, status: PhaseStatus) => void;
  setExpansionMode: (enabled: boolean) => void;
  setExpansionProfile: (profile: ExpansionProfile) => void;
  resetRoadmap: () => void;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  roadmap: null,
  riskScores: null,
  startupProfile: null,
  expansionProfile: null,
  isExpansionMode: false,

  generateRoadmap: (profile) => {
    const roadmap = decisionEngine.generateRoadmap(profile);
    const riskScores = decisionEngine.computeRiskScores(profile);
    set({ roadmap, riskScores, startupProfile: profile });
  },

  updateTaskStatus: (phaseId, taskId, status) => {
    const { roadmap } = get();
    if (!roadmap) return;

    const updatedPhases = roadmap.phases.map((phase) => {
      if (phase.id !== phaseId) return phase;

      const updatedTasks = phase.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
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
      };
    });

    set({
      roadmap: {
        ...roadmap,
        phases: updatedPhases,
        lastUpdated: new Date().toISOString(),
      },
    });
  },

  setExpansionMode: (enabled) => set({ isExpansionMode: enabled }),

  setExpansionProfile: (profile) => set({ expansionProfile: profile }),

  resetRoadmap: () =>
    set({
      roadmap: null,
      riskScores: null,
      startupProfile: null,
      expansionProfile: null,
      isExpansionMode: false,
    }),
}));
