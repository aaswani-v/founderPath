import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Spacing, FontSize, FontWeight, useThemeColors } from '../theme';

interface RiskGaugeProps {
  label: string;
  score: number;
  color?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ label, score, color }) => {
  const colors = useThemeColors();
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, { toValue: score, duration: 1000, useNativeDriver: false }).start();
  }, [score]);

  const getColor = () => {
    if (color) return color;
    if (score <= 30) return colors.success;
    if (score <= 60) return colors.accent;
    return colors.accentSoft;
  };

  const getRiskLevel = () => {
    if (score <= 30) return 'Low';
    if (score <= 60) return 'Medium';
    return 'High';
  };

  const c = getColor();

  return (
    <View style={styles.container}>
      <View style={[styles.scoreInner, { borderColor: c }]}>
        <Animated.Text style={[styles.scoreText, { color: c }]}>
          {animVal.interpolate({ inputRange: [0, 100], outputRange: ['0', '100'] })}
        </Animated.Text>
      </View>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.riskLevel, { color: c }]}>{getRiskLevel()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1 },
  scoreInner: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.05)' },
  scoreText: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  label: { fontSize: FontSize.xs, textAlign: 'center' },
  riskLevel: { fontSize: FontSize.xs, fontWeight: FontWeight.semiBold, marginTop: 2 },
});
