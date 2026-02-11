import { StartupProfile, Roadmap, RiskScore } from '../models';

export interface UserDataJSON {
  profile: {
    founderType: string;
    startupType: string;
    goal: string;
    budgetRange: string;
    hasTechnicalBackground: boolean;
    marketType: string;
  } | null;
  roadmap: {
    totalPhases: number;
    currentPhase: string;
    completionPercent: number;
    phases: {
      name: string;
      status: string;
      taskCount: number;
      completedTasks: number;
    }[];
  } | null;
  riskScores: RiskScore | null;
  timestamp: string;
}

export const userDataService = {
  buildUserJSON(
    profile: StartupProfile | null,
    roadmap: Roadmap | null,
    riskScores: RiskScore | null
  ): UserDataJSON {
    const now = new Date().toISOString();

    if (!profile) {
      return { profile: null, roadmap: null, riskScores: null, timestamp: now };
    }

    const roadmapData = roadmap
      ? {
          totalPhases: roadmap.phases.length,
          currentPhase:
            roadmap.phases.find((p) => p.status === 'in_progress')?.name || 'None',
          completionPercent: Math.round(
            (roadmap.phases.reduce(
              (n, p) => n + p.tasks.filter((t) => t.status === 'completed').length,
              0
            ) /
              roadmap.phases.reduce((n, p) => n + p.tasks.length, 0)) *
              100
          ),
          phases: roadmap.phases.map((p) => ({
            name: p.name,
            status: p.status,
            taskCount: p.tasks.length,
            completedTasks: p.tasks.filter((t) => t.status === 'completed').length,
          })),
        }
      : null;

    return {
      profile: {
        founderType: profile.founderType,
        startupType: profile.startupType,
        goal: profile.goal,
        budgetRange: profile.budgetRange,
        hasTechnicalBackground: profile.hasTechnicalBackground,
        marketType: profile.marketType,
      },
      roadmap: roadmapData,
      riskScores,
      timestamp: now,
    };
  },

  buildSystemPrompt(data: UserDataJSON): string {
    if (!data.profile) {
      return `You are FounderAI, a helpful AI startup advisor. The user hasn't completed their profile yet, so provide general startup guidance. Be concise, friendly, and actionable.`;
    }

    const p = data.profile;
    const r = data.roadmap;

    return [
      `You are FounderAI, a personal AI startup advisor.`,
      `The founder is a ${p.founderType.replace(/_/g, ' ')} building a ${p.startupType} startup.`,
      `Goal: ${p.goal.replace(/_/g, ' ')}. Budget: ${p.budgetRange.replace(/_/g, ' ')}. Market: ${p.marketType.toUpperCase()}.`,
      `Technical background: ${p.hasTechnicalBackground ? 'Yes' : 'No'}.`,
      r ? `Currently in "${r.currentPhase}" phase (${r.completionPercent}% complete across ${r.totalPhases} phases).` : '',
      data.riskScores ? `Risk scores — Budget: ${data.riskScores.budgetRisk}, Skill gap: ${data.riskScores.skillGapRisk}, Market: ${data.riskScores.marketComplexity}. Readiness: ${data.riskScores.overallReadiness}/100.` : '',
      `Give concise, personalized advice. Use short paragraphs. Reference their specific situation.`,
    ]
      .filter(Boolean)
      .join(' ');
  },
};
