import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadius, Spacing, FontSize, FontWeight, useThemeColors } from '../theme';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label, value, onChangeText, placeholder, secureTextEntry = false,
  keyboardType = 'default', autoCapitalize = 'none', error, style,
}) => {
  const colors = useThemeColors();
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.border, color: colors.textPrimary },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderWidth: 1.5, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md - 2, fontSize: FontSize.md },
  error: { fontSize: FontSize.xs, marginTop: Spacing.xs },
});
