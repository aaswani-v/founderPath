import { create } from 'zustand';
import { LightColors, DarkColors, ThemeColors } from './colors';

interface ThemeState {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setSystemTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  colors: LightColors,
  toggleTheme: () =>
    set((state) => ({
      isDark: !state.isDark,
      colors: state.isDark ? LightColors : DarkColors,
    })),
  setSystemTheme: (isDark: boolean) =>
    set({
      isDark,
      colors: isDark ? DarkColors : LightColors,
    }),
}));

/**
 * Hook to get current theme colors.
 * Use this in every component instead of importing Colors directly.
 */
export const useThemeColors = () => useThemeStore((s) => s.colors);
