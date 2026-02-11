import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { useAuthStore, useOnboardingStore } from '../store';
import { useThemeStore, LightColors, DarkColors } from '../theme';

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
  const { isAuthenticated } = useAuthStore();
  const { isComplete } = useOnboardingStore();
  const { isDark } = useThemeStore();

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
