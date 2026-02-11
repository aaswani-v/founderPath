// ─── Enums ──────────────────────────────────────────────────────────

export type FounderType = 'student' | 'working_professional' | 'experienced';
export type StartupType = 'saas' | 'ecommerce' | 'service' | 'marketplace';
export type GoalType = 'build_mvp' | 'launch' | 'scale' | 'expand';
export type BudgetRange = 'very_low' | 'low' | 'medium' | 'high';
export type MarketType = 'b2b' | 'b2c';
export type PhaseStatus = 'pending' | 'in_progress' | 'completed';
export type ExpansionType = 'same_market' | 'new_market';

// ─── Core Interfaces ────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface StartupProfile {
  founderType: FounderType;
  startupType: StartupType;
  goal: GoalType;
  budgetRange: BudgetRange;
  hasTechnicalBackground: boolean;
  marketType: MarketType;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedCost: string;
  estimatedTime: string;
  status: PhaseStatus;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  status: PhaseStatus;
  completionPercentage: number;
  estimatedCost: string;
  estimatedTimeline: string;
}

export interface Roadmap {
  id: string;
  phases: Phase[];
  createdAt: string;
  lastUpdated: string;
}

export interface RiskScore {
  budgetRisk: number;      // 0–100
  skillGapRisk: number;    // 0–100
  marketComplexity: number; // 0–100
  overallReadiness: number; // 0–100
}

export interface ExpansionProfile {
  expansionType: ExpansionType;
  availableResources: string;
  teamSize: number;
  readinessScore: number;
}

// ─── Onboarding Steps ───────────────────────────────────────────────

export interface OnboardingAnswer {
  founderType?: FounderType;
  startupType?: StartupType;
  goal?: GoalType;
  budgetRange?: BudgetRange;
  hasTechnicalBackground?: boolean;
  marketType?: MarketType;
}
