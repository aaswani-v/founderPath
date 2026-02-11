import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { BorderRadius, FontSize, FontWeight, Spacing, useThemeColors } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const colors = useThemeColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: { backgroundColor: colors.accent },
    secondary: { backgroundColor: colors.secondary },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.accent },
    ghost: { backgroundColor: 'transparent' },
  };

  const textColorMap: Record<string, string> = {
    primary: colors.surfaceDark,
    secondary: colors.textLight,
    outline: colors.accent,
    ghost: colors.accent,
  };

  const sizeStyles: Record<string, ViewStyle> = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
    md: { paddingVertical: Spacing.md - 2, paddingHorizontal: Spacing.lg },
    lg: { paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.xl },
  };

  const fontSizeMap: Record<string, number> = {
    sm: FontSize.sm,
    md: FontSize.md,
    lg: FontSize.lg,
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[
          styles.base,
          variantStyles[variant],
          sizeStyles[size],
          disabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColorMap[variant]} size="small" />
        ) : (
          <Text
            style={[
              styles.text,
              { color: textColorMap[variant], fontSize: fontSizeMap[size] },
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  disabled: { opacity: 0.5 },
  text: { fontWeight: FontWeight.semiBold },
  textDisabled: { opacity: 0.7 },
});
