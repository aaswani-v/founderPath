import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { RoadmapScreen } from '../screens/roadmap/RoadmapScreen';
import { TransparencyScreen } from '../screens/dashboard/TransparencyScreen';
import { ExpansionScreen } from '../screens/dashboard/ExpansionScreen';
import { useThemeColors } from '../theme';
import { FontWeight } from '../theme';

const Stack = createNativeStackNavigator();

interface Props {
  hasCompletedOnboarding: boolean;
}

export const AppStack: React.FC<Props> = ({ hasCompletedOnboarding }) => {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: FontWeight.semiBold },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {!hasCompletedOnboarding ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Roadmap" component={RoadmapScreen} options={{ title: 'Roadmap' }} />
          <Stack.Screen name="Transparency" component={TransparencyScreen} options={{ title: 'Why This Roadmap?' }} />
          <Stack.Screen name="Expansion" component={ExpansionScreen} options={{ title: 'Market Expansion' }} />
        </>
      )}
    </Stack.Navigator>
  );
};
