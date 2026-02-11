// Light and dark color palettes

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  accentSoft: string;
  background: string;
  surface: string;
  surfaceDark: string;
  surfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  textMuted: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  border: string;
  divider: string;
  statusPending: string;
  statusInProgress: string;
  statusCompleted: string;
  cardShadow: string;
}

export const LightColors: ThemeColors = {
  primary: '#312C51',
  secondary: '#48426D',
  accent: '#F0C38E',
  accentSoft: '#F1AA9B',
  background: '#F8F7FC',
  surface: '#FFFFFF',
  surfaceDark: '#312C51',
  surfaceSecondary: '#48426D',
  textPrimary: '#312C51',
  textSecondary: '#6B6588',
  textLight: '#FFFFFF',
  textMuted: '#9E98B3',
  success: '#4CAF50',
  warning: '#F0C38E',
  danger: '#F1AA9B',
  info: '#48426D',
  border: '#E8E5F0',
  divider: '#F0EDF5',
  statusPending: '#9E98B3',
  statusInProgress: '#F0C38E',
  statusCompleted: '#4CAF50',
  cardShadow: '#312C51',
};

export const DarkColors: ThemeColors = {
  primary: '#E8E5F0',
  secondary: '#9E98B3',
  accent: '#F0C38E',
  accentSoft: '#F1AA9B',
  background: '#1A1726',
  surface: '#231F38',
  surfaceDark: '#2D2848',
  surfaceSecondary: '#352F54',
  textPrimary: '#F0EDF5',
  textSecondary: '#B0AAC4',
  textLight: '#FFFFFF',
  textMuted: '#6B6588',
  success: '#66BB6A',
  warning: '#F0C38E',
  danger: '#F1AA9B',
  info: '#9E98B3',
  border: '#3A3458',
  divider: '#2D2848',
  statusPending: '#6B6588',
  statusInProgress: '#F0C38E',
  statusCompleted: '#66BB6A',
  cardShadow: '#000000',
};

// Backwards compat — default export is light
export const Colors = LightColors;
