import { UserDataJSON, userDataService } from './userDataService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatConfig {
  apiEndpoint: string;
  apiKey: string;
  model: string;
}

// ── Configuration (reads API key from .env) ──────────────────────
const config: ChatConfig = {
  apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY || '',
  model: 'llama-3.3-70b-versatile',
};

export const aiChatService = {
  configure(endpoint: string, apiKey: string, model: string) {
    config.apiEndpoint = endpoint;
    config.apiKey = apiKey;
    config.model = model;
  },

  isConfigured(): boolean {
    return !!(config.apiEndpoint && config.apiKey && config.model);
  },

  async sendMessage(
    messages: ChatMessage[],
    userData: UserDataJSON
  ): Promise<string> {
    // If real API is configured, use it
    if (this.isConfigured()) {
      return this._callAPI(messages, userData);
    }
    // Otherwise use smart mock
    return this._mockResponse(messages, userData);
  },

  async _callAPI(
    messages: ChatMessage[],
    userData: UserDataJSON
  ): Promise<string> {
    const systemPrompt = userDataService.buildSystemPrompt(userData);

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
        .filter((m) => m.id !== 'welcome') // skip the hardcoded welcome bubble
        .map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: apiMessages,
        max_tokens: 1024,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`AI API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
  },

  async _mockResponse(
    messages: ChatMessage[],
    userData: UserDataJSON
  ): Promise<string> {
    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const p = userData.profile;

    // Context-aware mock responses
    if (lastMsg.includes('hello') || lastMsg.includes('hi') || lastMsg.includes('hey')) {
      return p
        ? `Hey there! 👋 I'm FounderAI, your personal startup advisor. I can see you're building a ${p.startupType} startup as a ${p.founderType.replace(/_/g, ' ')} founder. How can I help you today?`
        : `Hey! 👋 I'm FounderAI, your personal startup advisor. Tell me about your startup idea and I'll help you navigate the journey!`;
    }

    if (lastMsg.includes('budget') || lastMsg.includes('cost') || lastMsg.includes('money') || lastMsg.includes('fund')) {
      if (p?.budgetRange === 'very_low' || p?.budgetRange === 'low') {
        return `With a ${p.budgetRange.replace(/_/g, ' ')} budget, here's my advice:\n\n• **Bootstrap first** — validate your idea before spending anything\n• **Free tools** — use Figma (free), Firebase (free tier), Vercel (free)\n• **Apply to accelerators** — Y Combinator, Techstars, or local programs\n• **Revenue first** — try to get paying customers before seeking investment\n\nWould you like me to create a detailed budget breakdown for your ${p.startupType} startup?`;
      }
      return `Here are some smart budgeting strategies:\n\n• **Allocate 60%** to product development\n• **Reserve 20%** for marketing and user acquisition\n• **Keep 20%** as runway buffer\n• **Track burn rate** weekly, not monthly\n\nWant me to dive deeper into any of these areas?`;
    }

    if (lastMsg.includes('mvp') || lastMsg.includes('build') || lastMsg.includes('product')) {
      return p?.hasTechnicalBackground
        ? `Since you have a technical background, here's your MVP roadmap:\n\n1. **Week 1–2**: Define core features (max 3)\n2. **Week 3–4**: Build and iterate\n3. **Week 5**: Beta testing with 10 users\n4. **Week 6**: Launch on Product Hunt\n\nFocus on solving ONE problem exceptionally well. What's the core problem you're solving?`
        : `Without a technical background, here are your best options:\n\n• **No-code tools** — Bubble, Webflow, or Adalo for rapid prototyping\n• **Find a co-founder** — check AngelList, Indie Hackers, or local meetups\n• **Hire freelancers** — Upwork or Toptal for specific features\n• **Use templates** — many SaaS templates exist for common startup types\n\nWhich approach interests you most?`;
    }

    if (lastMsg.includes('market') || lastMsg.includes('customer') || lastMsg.includes('user')) {
      const market = p?.marketType === 'b2b' ? 'B2B' : 'B2C';
      return `For your ${market} ${p?.startupType || 'startup'}, here's how to find customers:\n\n• **${market === 'B2B' ? 'LinkedIn outreach' : 'Social media'}** — start building your audience now\n• **Content marketing** — share your expertise and journey\n• **Community** — join relevant Slack/Discord groups\n• **Early adopters** — offer exclusive deals to first 50 users\n\nWhat's your biggest challenge in reaching customers?`;
    }

    if (lastMsg.includes('risk') || lastMsg.includes('challenge') || lastMsg.includes('problem')) {
      const risks = userData.riskScores;
      if (risks) {
        const highest = risks.budgetRisk >= risks.skillGapRisk && risks.budgetRisk >= risks.marketComplexity
          ? 'budget' : risks.skillGapRisk >= risks.marketComplexity ? 'skill gap' : 'market complexity';
        return `Based on your profile, your highest risk area is **${highest}** (score: ${Math.max(risks.budgetRisk, risks.skillGapRisk, risks.marketComplexity)}/100).\n\nHere's how to mitigate it:\n\n${highest === 'budget' ? '• Start with free tools and bootstrap\n• Apply for grants and accelerators\n• Focus on revenue-generating features first' : highest === 'skill gap' ? '• Take online courses (Coursera, Udemy)\n• Find a complementary co-founder\n• Join a startup community for mentorship' : '• Do more customer interviews (aim for 20+)\n• Study competitors deeply\n• Start with a niche before going broad'}\n\nYour overall readiness is ${risks.overallReadiness}/100. Want to work on improving it?`;
      }
      return `Every startup faces risks. The key is identifying and mitigating them early. What specific challenge are you facing right now?`;
    }

    // Default contextual response
    if (p) {
      return `Great question! As a ${p.founderType.replace(/_/g, ' ')} founder building a ${p.startupType} startup in the ${p.marketType.toUpperCase()} space, here are my thoughts:\n\n• Focus on your current phase and complete the tasks in your roadmap\n• Your biggest advantage is ${p.hasTechnicalBackground ? 'your technical skills — leverage them for rapid prototyping' : 'your domain expertise — use it to understand user needs deeply'}\n• Consider connecting with other ${p.startupType} founders for insights\n\nWhat specific aspect would you like to explore further?`;
    }

    return `That's a great question! Here are some general tips:\n\n• **Validate first** — talk to at least 10 potential customers\n• **Start small** — focus on one problem, one solution\n• **Move fast** — build an MVP in 4–6 weeks\n• **Learn constantly** — read, network, iterate\n\nTell me more about your startup idea and I can give more specific advice!`;
  },
};
