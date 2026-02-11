import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '../../components';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors } from '../../theme';
import { useAuthStore } from '../../store';

type Props = { navigation: NativeStackNavigationProp<any> };

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const colors = useThemeColors();

  const handleLogin = async () => {
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.surfaceDark }]}>
            <Ionicons name="diamond" size={32} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>FounderPath</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your personalized startup roadmap</Text>
        </View>

        <View style={styles.form}>
          {error && (
            <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}20` }]}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} style={{ marginRight: 8 }} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            </View>
          )}
          <Input label="Email" value={email} onChangeText={(t) => { clearError(); setEmail(t); }} placeholder="founder@startup.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={(t) => { clearError(); setPassword(t); }} placeholder="Enter your password" secureTextEntry />
          <Button title="Sign In" onPress={handleLogin} loading={isLoading} disabled={!email || !password} style={{ marginTop: Spacing.md }} />
          <Button title="Create an Account" onPress={() => navigation.navigate('Register')} variant="ghost" style={{ marginTop: Spacing.sm }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoContainer: { width: 72, height: 72, borderRadius: BorderRadius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize.xxxl, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md },
  form: { width: '100%' },
  errorBanner: { borderRadius: BorderRadius.sm, padding: Spacing.md, marginBottom: Spacing.md, flexDirection: 'row', alignItems: 'center' },
  errorText: { fontSize: FontSize.sm, flex: 1 },
});
