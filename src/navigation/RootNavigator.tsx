import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { useAuthStore, useOnboardingStore, useRoadmapStore } from '../store';
import { useThemeStore, LightColors, DarkColors } from '../theme';
import { View, ActivityIndicator } from 'react-native';

const CustomLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: LightColors.background,
    card: LightColors.surface,
    text: LightColors.textPrimary,
    border: LightColors.border,
    primary: LightColors.accent,
  },
};

const CustomDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: DarkColors.background,
    card: DarkColors.surface,
    text: DarkColors.textPrimary,
    border: DarkColors.border,
    primary: DarkColors.accent,
  },
};

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, checkSession, isLoading } = useAuthStore();
  const { isComplete, _hydrated: onboardingHydrated, hydrate: hydrateOnboarding } = useOnboardingStore();
  const { _hydrated: roadmapHydrated, hydrate: hydrateRoadmap } = useRoadmapStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    checkSession();
    hydrateOnboarding();
    hydrateRoadmap();
  }, [checkSession, hydrateOnboarding, hydrateRoadmap]);

  if (isLoading || !onboardingHydrated || !roadmapHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? DarkColors.background : LightColors.background }}>
        <ActivityIndicator size="large" color={isDark ? DarkColors.accent : LightColors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={isDark ? CustomDark : CustomLight}>
      {isAuthenticated ? (
        <AppStack hasCompletedOnboarding={isComplete} />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
