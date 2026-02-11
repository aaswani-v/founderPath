// services/decisionEngine.ts
// TODO: Load decision rules from JSON or Firestore
// TODO: Generate roadmap based on startup constraints
// This file provides a structured placeholder for the future rule engine.

import { StartupProfile, Roadmap, Phase, RiskScore } from '../models';
import { mockRoadmaps } from '../data/mockRoadmaps';
import { computeMockRiskScores } from '../data/mockRiskScores';

/**
 * Decision Engine Service
 *
 * This service is the core intelligence layer of the app.
 * Currently returns mock data structured to match the expected output.
 *
 * Future implementation:
 * - Load decision trees from JSON config or Firestore
 * - Apply constraint-based rules to generate personalized roadmaps
 * - Use weighted scoring for risk assessment
 */
export const decisionEngine = {
  /**
   * Generate a personalized roadmap based on the founder's startup profile.
   * TODO: Replace with actual rule engine logic
   */
  generateRoadmap(profile: StartupProfile): Roadmap {
    // For now, return a mock roadmap that adapts slightly to the profile
    return mockRoadmaps.getForProfile(profile);
  },

  /**
   * Compute risk scores based on the startup profile.
   * TODO: Replace with weighted scoring model
   */
  computeRiskScores(profile: StartupProfile): RiskScore {
    return computeMockRiskScores(profile);
  },

  /**
   * Generate explanation text for why this roadmap was chosen.
   * TODO: Replace with AI-powered explanation generation
   */
  generateExplanation(profile: StartupProfile): string[] {
    const explanations: string[] = [];

    if (profile.budgetRange === 'very_low' || profile.budgetRange === 'low') {
      explanations.push(
        'Because your startup has a limited budget, validation is prioritized before company registration to minimize upfront costs.'
      );
    }

    if (profile.marketType === 'b2c') {
      explanations.push(
        'As a B2C product, market validation through user research is emphasized early in your roadmap.'
      );
    }

    if (profile.founderType === 'student') {
      explanations.push(
        'As a student founder, we\'ve structured the timeline around academic schedules and minimized capital-intensive steps.'
      );
    }

    if (!profile.hasTechnicalBackground) {
      explanations.push(
        'Since you don\'t have a technical background, we\'ve included steps for finding a technical co-founder or using no-code tools for your MVP.'
      );
    }

    if (profile.startupType === 'saas') {
      explanations.push(
        'For SaaS businesses, we focus heavily on product-market fit validation before scaling infrastructure.'
      );
    }

    if (profile.goal === 'scale') {
      explanations.push(
        'With scaling as your goal, growth-phase tasks like automation and team expansion are given higher priority.'
      );
    }

    if (explanations.length === 0) {
      explanations.push(
        'Your roadmap has been tailored based on your unique combination of constraints and goals.'
      );
    }

    return explanations;
  },
};
