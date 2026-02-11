import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { BorderRadius, Spacing, FontSize, FontWeight, useThemeColors } from '../theme';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress, label, showPercentage = true, color, height = 8, style,
}) => {
  const colors = useThemeColors();
  const fillColor = color || colors.accent;
  const clamped = Math.min(100, Math.max(0, progress));
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: clamped,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [clamped]);

  const animWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={styles.labelRow}>
          {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
          {showPercentage && <Text style={[styles.pct, { color: colors.textPrimary }]}>{Math.round(clamped)}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height, backgroundColor: colors.divider }]}>
        <Animated.View
          style={[styles.fill, { width: animWidth, backgroundColor: fillColor, height }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  pct: { fontSize: FontSize.sm, fontWeight: FontWeight.semiBold },
  track: { borderRadius: BorderRadius.full, overflow: 'hidden' },
  fill: { borderRadius: BorderRadius.full },
});
