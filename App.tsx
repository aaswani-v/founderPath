import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { useThemeStore } from './src/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const systemColorScheme = useColorScheme();
  const setSystemTheme = useThemeStore((s) => s.setSystemTheme);
  const isDark = useThemeStore((s) => s.isDark);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    setSystemTheme(systemColorScheme === 'dark');
  }, [systemColorScheme, setSystemTheme]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <RootNavigator />
      </View>
    </SafeAreaProvider>
  );
}
