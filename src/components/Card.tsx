import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { BorderRadius, Spacing, FontSize, FontWeight, useThemeColors } from '../theme';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'accent';
  style?: ViewStyle;
  animateIn?: boolean;
  delay?: number;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  variant = 'default',
  style,
  animateIn = true,
  delay = 0,
}) => {
  const colors = useThemeColors();
  const fadeAnim = useRef(new Animated.Value(animateIn ? 0 : 1)).current;
  const slideAnim = useRef(new Animated.Value(animateIn ? 20 : 0)).current;

  useEffect(() => {
    if (animateIn) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  const bgMap: Record<string, string> = {
    default: colors.surface,
    dark: colors.surfaceDark,
    accent: colors.accent,
  };

  const titleColor = variant === 'default' ? colors.textPrimary : colors.textLight;
  const subtitleColor = variant === 'default' ? colors.textSecondary : 'rgba(255,255,255,0.7)';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgMap[variant],
          shadowColor: colors.cardShadow,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      {title && (
        <View style={styles.header}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
          )}
        </View>
      )}
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { marginBottom: Spacing.md },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  subtitle: { fontSize: FontSize.sm, marginTop: Spacing.xs },
});
