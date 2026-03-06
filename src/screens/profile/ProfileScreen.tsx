import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors, useThemeStore } from '../../theme';
import { useAuthStore, useCurrencyStore, CURRENCIES } from '../../store';
import type { CurrencyCode } from '../../store';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colors = useThemeColors();
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { currency, setCurrency } = useCurrencyStore();

  const initial = (user?.displayName || user?.email || 'U')[0].toUpperCase();

  const currencyOptions: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP'];

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[s.backBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[s.title, { color: colors.textPrimary }]}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Avatar + Info */}
        <View style={s.avatarSection}>
          {user?.photoUri ? (
            <Image source={{ uri: user.photoUri }} style={[s.avatar, s.avatarImage, { borderColor: colors.accent }]} />
          ) : (
            <View style={[s.avatar, { backgroundColor: colors.accent }]}>
              <Text style={s.avatarText}>{initial}</Text>
            </View>
          )}
          <Text style={[s.userName, { color: colors.textPrimary }]}>{user?.displayName || 'Founder'}</Text>
          <Text style={[s.userEmail, { color: colors.textMuted }]}>{user?.email || ''}</Text>
        </View>

        {/* Settings */}
        <View style={[s.section, { backgroundColor: colors.surface }]}>
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>PREFERENCES</Text>

          {/* Dark/Light Mode */}
          <TouchableOpacity onPress={toggleTheme} style={[s.row, { borderBottomColor: colors.divider }]}>
            <View style={[s.rowIcon, { backgroundColor: `${colors.accent}15` }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={colors.accent} />
            </View>
            <Text style={[s.rowLabel, { color: colors.textPrimary }]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Ionicons name="swap-horizontal" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Currency */}
          <View style={[s.row, { borderBottomColor: colors.divider, flexWrap: 'wrap' }]}>
            <View style={[s.rowIcon, { backgroundColor: `${colors.accent}15` }]}>
              <Text style={{ fontSize: 16, color: colors.accent }}>{CURRENCIES[currency].symbol}</Text>
            </View>
            <Text style={[s.rowLabel, { color: colors.textPrimary, flex: 1 }]}>Currency</Text>
          </View>
          <View style={s.currencyPills}>
            {currencyOptions.map((code) => (
              <TouchableOpacity
                key={code}
                onPress={() => setCurrency(code)}
                style={[
                  s.pill,
                  {
                    backgroundColor: currency === code ? colors.accent : colors.divider,
                    borderColor: currency === code ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text style={[s.pillText, { color: currency === code ? '#FFFFFF' : colors.textPrimary }]}>
                  {CURRENCIES[code].symbol} {code}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account */}
        <View style={[s.section, { backgroundColor: colors.surface }]}>
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>ACCOUNT</Text>

          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={[s.row, { borderBottomColor: colors.divider }]}>
            <View style={[s.rowIcon, { backgroundColor: `${colors.accent}15` }]}>
              <Ionicons name="create-outline" size={18} color={colors.accent} />
            </View>
            <Text style={[s.rowLabel, { color: colors.textPrimary }]}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => { await logout(); }}
            style={s.row}
          >
            <View style={[s.rowIcon, { backgroundColor: 'rgba(255,69,58,0.1)' }]}>
              <Ionicons name="log-out-outline" size={18} color="#FF453A" />
            </View>
            <Text style={[s.rowLabel, { color: '#FF453A' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={[s.version, { color: colors.textMuted }]}>FounderPath v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  avatarImage: { borderWidth: 3 },
  avatarText: { fontSize: 32, fontWeight: FontWeight.bold, color: '#FFFFFF' },
  userName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  userEmail: { fontSize: FontSize.sm, marginTop: 4 },
  section: { borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, overflow: 'hidden' },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 1, padding: Spacing.md, paddingBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  rowLabel: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  currencyPills: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, paddingTop: Spacing.xs, gap: Spacing.sm },
  pill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, borderWidth: 1 },
  pillText: { fontSize: FontSize.sm, fontWeight: FontWeight.semiBold },
  version: { textAlign: 'center', fontSize: FontSize.xs, marginTop: Spacing.md },
});
