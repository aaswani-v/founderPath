import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BorderRadius, Spacing, FontSize, FontWeight, useThemeColors } from '../theme';

interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  style?: ViewStyle;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  label, description, selected, onPress, iconName, style,
}) => {
  const colors = useThemeColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[
          styles.container,
          {
            backgroundColor: selected ? `${colors.accent}15` : colors.surface,
            borderColor: selected ? colors.accent : colors.border,
          },
          style,
        ]}
      >
        {iconName && (
          <MaterialCommunityIcons
            name={iconName}
            size={28}
            color={selected ? colors.accent : colors.textMuted}
            style={styles.icon}
          />
        )}
        <Text style={[styles.label, { color: selected ? colors.textPrimary : colors.textPrimary }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.description, { color: selected ? colors.textSecondary : colors.textMuted }]}>
            {description}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { borderWidth: 2, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, alignItems: 'center' },
  icon: { marginBottom: Spacing.sm },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semiBold, textAlign: 'center' },
  description: { fontSize: FontSize.xs, textAlign: 'center', marginTop: Spacing.xs },
});
