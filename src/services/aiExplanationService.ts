// services/aiExplanationService.ts
// TODO: Integrate AI API for dynamic explanation generation
// This file provides static explanation templates that mimic AI-generated responses.

import { StartupProfile } from '../models';

/**
 * AI Explanation Service
 *
 * Future implementation will call an LLM API to generate
 * context-aware explanations for roadmap decisions.
 *
 * Currently uses template-based string generation.
 */
export const aiExplanationService = {
  /**
   * TODO: Replace with actual AI API call
   */
  async getExplanation(profile: StartupProfile): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const parts: string[] = [
      `Your roadmap has been customized for a ${profile.founderType.replace('_', ' ')} founder`,
      `building a ${profile.startupType} startup`,
      `targeting the ${profile.marketType.toUpperCase()} market`,
      `with a ${profile.budgetRange.replace('_', ' ')} budget.`,
    ];

    return parts.join(' ');
  },

  /**
   * TODO: Replace with AI-driven recommendations
   */
  async getRecommendations(profile: StartupProfile): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const recommendations: string[] = [];

    if (profile.budgetRange === 'very_low' || profile.budgetRange === 'low') {
      recommendations.push('Consider applying to startup accelerators for funding and mentorship.');
      recommendations.push('Use free or low-cost tools for your initial MVP (Figma, Notion, Firebase free tier).');
    }

    if (!profile.hasTechnicalBackground) {
      recommendations.push('Explore no-code platforms like Bubble or Webflow for rapid prototyping.');
      recommendations.push('Network in startup communities to find a technical co-founder.');
    }

    if (profile.marketType === 'b2c') {
      recommendations.push('Start building an audience on social media before your product launch.');
    }

    if (profile.goal === 'build_mvp') {
      recommendations.push('Focus on solving one core problem exceptionally well before adding features.');
    }

    return recommendations;
  },
};
