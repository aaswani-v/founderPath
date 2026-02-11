import { StartupProfile, RiskScore } from '../models';

/**
 * Computes mock risk scores based on the startup profile.
 * These scores vary based on profile constraints to feel dynamic.
 */
export function computeMockRiskScores(profile: StartupProfile): RiskScore {
  let budgetRisk = 50;
  let skillGapRisk = 50;
  let marketComplexity = 50;

  // Budget risk
  switch (profile.budgetRange) {
    case 'very_low': budgetRisk = 85; break;
    case 'low': budgetRisk = 65; break;
    case 'medium': budgetRisk = 40; break;
    case 'high': budgetRisk = 20; break;
  }

  // Skill gap risk
  if (!profile.hasTechnicalBackground) {
    skillGapRisk += 25;
  }
  if (profile.founderType === 'student') {
    skillGapRisk += 10;
  }
  if (profile.founderType === 'experienced') {
    skillGapRisk -= 20;
  }
  skillGapRisk = Math.min(100, Math.max(0, skillGapRisk));

  // Market complexity
  if (profile.marketType === 'b2b') {
    marketComplexity += 15;
  }
  if (profile.startupType === 'marketplace') {
    marketComplexity += 20;
  }
  if (profile.startupType === 'service') {
    marketComplexity -= 10;
  }
  marketComplexity = Math.min(100, Math.max(0, marketComplexity));

  const overallReadiness = Math.round(
    100 - (budgetRisk * 0.3 + skillGapRisk * 0.3 + marketComplexity * 0.4)
  );

  return {
    budgetRisk,
    skillGapRisk,
    marketComplexity,
    overallReadiness: Math.max(0, Math.min(100, overallReadiness)),
  };
}
