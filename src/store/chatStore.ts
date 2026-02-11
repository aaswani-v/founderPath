import { create } from 'zustand';
import { ChatMessage, aiChatService } from '../services/aiChatService';
import { userDataService } from '../services/userDataService';
import { useRoadmapStore } from './roadmapStore';

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hey! 👋 I'm **FounderAI**, your personal startup advisor.\n\nI can help you with:\n• 📋 **Roadmap guidance** — what to do next\n• 💰 **Budget planning** — how to spend wisely\n• 🎯 **Strategy** — market, product, growth\n• ⚠️ **Risk analysis** — identify and mitigate risks\n\nAsk me anything about your startup journey!`,
      timestamp: new Date().toISOString(),
    },
  ],
  isTyping: false,

  sendMessage: async (content: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
    }));

    try {
      // Build user context from stores
      const { startupProfile, roadmap, riskScores } = useRoadmapStore.getState();
      const userData = userDataService.buildUserJSON(startupProfile, roadmap, riskScores);

      const allMessages = [...get().messages];
      const response = await aiChatService.sendMessage(allMessages, userData);

      const botMsg: ChatMessage = {
        id: `msg_${Date.now()}_bot`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, botMsg],
        isTyping: false,
      }));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        role: 'assistant',
        content: `Sorry, I encountered an error. Please try again. (${err.message || 'Unknown error'})`,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, errorMsg],
        isTyping: false,
      }));
    }
  },

  clearChat: () =>
    set({
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hey! 👋 I'm **FounderAI**, your personal startup advisor. Ask me anything about your startup journey!`,
          timestamp: new Date().toISOString(),
        },
      ],
      isTyping: false,
    }),
}));
