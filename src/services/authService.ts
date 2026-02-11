// services/authService.ts
// TODO: Integrate Firebase Authentication
// This file contains placeholder auth functions that simulate
// authentication without making real network calls.

import { UserProfile } from '../models';

const MOCK_USER: UserProfile = {
  id: 'user_001',
  email: 'founder@example.com',
  displayName: 'Alex Founder',
  createdAt: new Date().toISOString(),
  onboardingCompleted: false,
};

export const authService = {
  /**
   * TODO: Replace with Firebase signInWithEmailAndPassword
   */
  async login(email: string, password: string): Promise<UserProfile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    return { ...MOCK_USER, email };
  },

  /**
   * TODO: Replace with Firebase createUserWithEmailAndPassword
   */
  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !password || !displayName) {
      throw new Error('All fields are required');
    }

    return {
      ...MOCK_USER,
      email,
      displayName,
      id: `user_${Date.now()}`,
    };
  },

  /**
   * TODO: Replace with Firebase signOut
   */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};
