import { create } from 'zustand';
import { UserProfile } from '../models';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (displayName: string, photoUri?: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading to check session
  error: null,

  checkSession: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const u = data.session.user;
        const profile: UserProfile = {
          id: u.id,
          email: u.email || '',
          displayName: u.user_metadata?.display_name || u.email?.split('@')[0] || 'User',
          photoUri: u.user_metadata?.photo_uri,
          createdAt: u.created_at,
          onboardingCompleted: false, // We'll need a better way to persist this later (e.g. in 'profiles' table)
        };
        set({ user: profile, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login Error:', error);
      let msg = error.message;
      if (msg.includes('Email not confirmed') || error.status === 400) {
        msg = 'Please confirm your email address before signing in.';
      }
      set({ error: msg, isLoading: false });
      return;
    }

    if (data.user) {
      const u = data.user;
      const profile: UserProfile = {
        id: u.id,
        email: u.email || '',
        displayName: u.user_metadata?.display_name || u.email?.split('@')[0] || 'User',
        photoUri: u.user_metadata?.photo_uri,
        createdAt: u.created_at,
        onboardingCompleted: false,
      };
      set({ user: profile, isAuthenticated: true, isLoading: false });
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    if (data.user) {
      const u = data.user;
      // Auto-login on sign up if session exists (Supabase default behavior unless confirm needed)
      const profile: UserProfile = {
        id: u.id,
        email: u.email || '',
        displayName: displayName,
        photoUri: undefined,
        createdAt: u.created_at,
        onboardingCompleted: false,
      };
      set({ user: profile, isAuthenticated: !!data.session, isLoading: false });
      
      if (!data.session) {
        set({ error: 'Please check your email to confirm your account.' });
      }
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  updateProfile: async (displayName, photoUri) => {
    const { user } = get();
    if (!user) return;

    // Optimistic update
    set({ user: { ...user, displayName, photoUri: photoUri ?? user.photoUri } });

    // Persist to Supabase Auth metadata
    const updates: any = { display_name: displayName };
    if (photoUri !== undefined) updates.photo_uri = photoUri;

    const { error } = await supabase.auth.updateUser({
      data: updates
    });
    
    if (error) {
      console.error('Failed to update auth metadata:', error);
      // Revert if needed? For now we just log.
    }
  },

  clearError: () => set({ error: null }),
}));
