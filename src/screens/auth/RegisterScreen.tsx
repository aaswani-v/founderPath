import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '../../components';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors } from '../../theme';
import { useAuthStore } from '../../store';

type Props = { navigation: NativeStackNavigationProp<any> };

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const colors = useThemeColors();

  const passwordsMatch = password === confirmPassword;
  const isValid = displayName && email && password && confirmPassword && passwordsMatch;

  const handleRegister = async () => {
    if (!isValid) return;
    await register(email, password, displayName);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Start building your startup roadmap</Text>
        </View>
        <View style={styles.form}>
          {error && (
            <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}20` }]}>
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            </View>
          )}
          <Input label="Full Name" value={displayName} onChangeText={(t) => { clearError(); setDisplayName(t); }} placeholder="Alex Founder" autoCapitalize="words" />
          <Input label="Email" value={email} onChangeText={(t) => { clearError(); setEmail(t); }} placeholder="founder@startup.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={(t) => { clearError(); setPassword(t); }} placeholder="Create a password" secureTextEntry />
          <Input label="Confirm Password" value={confirmPassword} onChangeText={(t) => { clearError(); setConfirmPassword(t); }} placeholder="Confirm your password" secureTextEntry error={confirmPassword && !passwordsMatch ? 'Passwords do not match' : undefined} />
          <Button title="Create Account" onPress={handleRegister} loading={isLoading} disabled={!isValid} style={{ marginTop: Spacing.md }} />
          <Button title="Already have an account? Sign In" onPress={() => navigation.goBack()} variant="ghost" style={{ marginTop: Spacing.sm }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md },
  form: { width: '100%' },
  errorBanner: { borderRadius: BorderRadius.sm, padding: Spacing.md, marginBottom: Spacing.md },
  errorText: { fontSize: FontSize.sm, textAlign: 'center' },
});
