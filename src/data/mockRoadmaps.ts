import { StartupProfile, Roadmap, Phase, Task } from '../models';

// ─── Task Templates ─────────────────────────────────────────────────

const validationTasks: Task[] = [
  { id: 'v1', title: 'Define Problem Statement', description: 'Clearly articulate the problem you are solving', estimatedCost: '$0', estimatedTime: '2 days', status: 'pending' },
  { id: 'v2', title: 'Identify Target Audience', description: 'Create detailed user personas', estimatedCost: '$0', estimatedTime: '3 days', status: 'pending' },
  { id: 'v3', title: 'Competitor Analysis', description: 'Research existing solutions in the market', estimatedCost: '$0–$50', estimatedTime: '3 days', status: 'pending' },
  { id: 'v4', title: 'User Interviews (5–10)', description: 'Conduct discovery interviews with potential users', estimatedCost: '$0–$100', estimatedTime: '1 week', status: 'pending' },
  { id: 'v5', title: 'Validate Willingness to Pay', description: 'Test if users would pay for your solution', estimatedCost: '$0', estimatedTime: '3 days', status: 'pending' },
];

const legalTasks: Task[] = [
  { id: 'l1', title: 'Choose Business Structure', description: 'Decide between Sole Prop, LLC, or Corporation', estimatedCost: '$0–$500', estimatedTime: '2 days', status: 'pending' },
  { id: 'l2', title: 'Register Business Name', description: 'Register your company name with local authorities', estimatedCost: '$50–$300', estimatedTime: '1 week', status: 'pending' },
  { id: 'l3', title: 'Open Business Bank Account', description: 'Separate personal and business finances', estimatedCost: '$0', estimatedTime: '2 days', status: 'pending' },
  { id: 'l4', title: 'Draft Co-Founder Agreement', description: 'If applicable, formalize equity splits and roles', estimatedCost: '$0–$1000', estimatedTime: '1 week', status: 'pending' },
];

const mvpTasks: Task[] = [
  { id: 'm1', title: 'Define Core Features', description: 'List the minimum features needed for launch', estimatedCost: '$0', estimatedTime: '2 days', status: 'pending' },
  { id: 'm2', title: 'Create Wireframes', description: 'Design low-fidelity wireframes', estimatedCost: '$0–$100', estimatedTime: '3 days', status: 'pending' },
  { id: 'm3', title: 'Build MVP', description: 'Develop the minimum viable product', estimatedCost: '$500–$5000', estimatedTime: '2–6 weeks', status: 'pending' },
  { id: 'm4', title: 'Internal Testing', description: 'Test with team and close network', estimatedCost: '$0', estimatedTime: '1 week', status: 'pending' },
  { id: 'm5', title: 'Collect Beta Feedback', description: 'Gather feedback from early users', estimatedCost: '$0–$200', estimatedTime: '2 weeks', status: 'pending' },
];

const launchTasks: Task[] = [
  { id: 'la1', title: 'Prepare Launch Strategy', description: 'Plan channels, messaging, and timeline', estimatedCost: '$0–$500', estimatedTime: '1 week', status: 'pending' },
  { id: 'la2', title: 'Set Up Analytics', description: 'Implement tracking for key metrics', estimatedCost: '$0–$100', estimatedTime: '2 days', status: 'pending' },
  { id: 'la3', title: 'Create Landing Page', description: 'Build a conversion-optimized landing page', estimatedCost: '$0–$300', estimatedTime: '3 days', status: 'pending' },
  { id: 'la4', title: 'Launch on Product Hunt / Social', description: 'Execute public launch', estimatedCost: '$0–$200', estimatedTime: '1 day', status: 'pending' },
  { id: 'la5', title: 'Monitor & Iterate', description: 'Track metrics and fix critical issues', estimatedCost: '$0', estimatedTime: 'Ongoing', status: 'pending' },
];

const growthTasks: Task[] = [
  { id: 'g1', title: 'Analyze Growth Metrics', description: 'Identify key levers for growth', estimatedCost: '$0', estimatedTime: '1 week', status: 'pending' },
  { id: 'g2', title: 'Optimize Conversion Funnel', description: 'A/B test and improve sign-up flow', estimatedCost: '$100–$500', estimatedTime: '2 weeks', status: 'pending' },
  { id: 'g3', title: 'Explore Partnerships', description: 'Identify and reach out to potential partners', estimatedCost: '$0–$500', estimatedTime: '2 weeks', status: 'pending' },
  { id: 'g4', title: 'Hire First Team Member', description: 'If needed, bring on support', estimatedCost: '$1000+/month', estimatedTime: '2–4 weeks', status: 'pending' },
  { id: 'g5', title: 'Seek Funding (if applicable)', description: 'Prepare pitch deck and approach investors', estimatedCost: '$0–$1000', estimatedTime: '4–8 weeks', status: 'pending' },
];

// ─── Phases ─────────────────────────────────────────────────────────

function buildPhases(): Phase[] {
  return [
    {
      id: 'phase_validation',
      name: 'Validation',
      description: 'Validate your idea before investing time and money',
      tasks: validationTasks.map((t) => ({ ...t })),
      status: 'in_progress',
      completionPercentage: 0,
      estimatedCost: '$0–$150',
      estimatedTimeline: '2–3 weeks',
    },
    {
      id: 'phase_legal',
      name: 'Legal & Structure',
      description: 'Set up the legal foundation for your business',
      tasks: legalTasks.map((t) => ({ ...t })),
      status: 'pending',
      completionPercentage: 0,
      estimatedCost: '$50–$1800',
      estimatedTimeline: '1–2 weeks',
    },
    {
      id: 'phase_mvp',
      name: 'Product / MVP',
      description: 'Build and test your minimum viable product',
      tasks: mvpTasks.map((t) => ({ ...t })),
      status: 'pending',
      completionPercentage: 0,
      estimatedCost: '$500–$5300',
      estimatedTimeline: '3–8 weeks',
    },
    {
      id: 'phase_launch',
      name: 'Launch',
      description: 'Go to market with your product',
      tasks: launchTasks.map((t) => ({ ...t })),
      status: 'pending',
      completionPercentage: 0,
      estimatedCost: '$0–$1100',
      estimatedTimeline: '1–2 weeks',
    },
    {
      id: 'phase_growth',
      name: 'Growth',
      description: 'Scale your startup and optimize for growth',
      tasks: growthTasks.map((t) => ({ ...t })),
      status: 'pending',
      completionPercentage: 0,
      estimatedCost: '$1100–$3000+',
      estimatedTimeline: '4–12 weeks',
    },
  ];
}

// ─── Mock Roadmap Generator ────────────────────────────────────────

export const mockRoadmaps = {
  getForProfile(_profile: StartupProfile): Roadmap {
    return {
      id: `roadmap_${Date.now()}`,
      phases: buildPhases(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
  },
};
