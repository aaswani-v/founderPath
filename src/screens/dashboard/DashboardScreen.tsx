import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, ProgressBar, RiskGauge } from '../../components';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors, useThemeStore } from '../../theme';
import { useRoadmapStore, useAuthStore, useOnboardingStore, useCurrencyStore } from '../../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fmt = (v: string) => v.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

export const DashboardScreen: React.FC = () => {
  React.useEffect(() => {
    AsyncStorage.getAllKeys().then((keys) => {
      AsyncStorage.multiGet(keys).then((result) => {
        console.table(result);
      });
    });
  }, []);
  const { roadmap, riskScores, startupProfile } = useRoadmapStore();
  const { user } = useAuthStore();
  const { wasSkipped } = useOnboardingStore();
  const { currency } = useCurrencyStore();
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { isDark } = useThemeStore();

  const initial = (user?.displayName || user?.email || 'U')[0].toUpperCase();

  if (!roadmap || !riskScores || !startupProfile) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
        <View style={s.emptyState}>
          <Ionicons name="map-outline" size={64} color={colors.textMuted} />
          <Text style={[s.emptyTitle, { color: colors.textPrimary }]}>No Roadmap Yet</Text>
          <Text style={[s.emptySub, { color: colors.textSecondary }]}>Complete onboarding to generate your personalized startup roadmap.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalTasks = roadmap.phases.reduce((n: number, p) => n + p.tasks.length, 0);
  const doneTasks = roadmap.phases.reduce((n: number, p) => n + p.tasks.filter(t => t.status === 'completed').length, 0);
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const activePhase = roadmap.phases.find(p => p.status === 'in_progress') || roadmap.phases[0];

  const topicIcons: { name: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; phase: string }[] = [
    { name: 'Validation', icon: 'lightbulb-on', phase: 'Validation' },
    { name: 'Legal', icon: 'gavel', phase: 'Legal & Structure' },
    { name: 'MVP', icon: 'hammer-wrench', phase: 'Product / MVP' },
    { name: 'Launch', icon: 'rocket-launch', phase: 'Launch' },
    { name: 'Growth', icon: 'chart-line', phase: 'Growth' },
  ];

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Header ────────────────────────────────── */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={[s.greeting, { color: colors.textPrimary }]}>Hello, {user?.displayName || 'Founder'}</Text>
            <Text style={[s.headerSub, { color: colors.textSecondary }]}>Here's your startup progress</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity onPress={() => useThemeStore.getState().toggleTheme()} style={[s.themeBtn, { backgroundColor: colors.surface }]}>
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={[s.avatarBtn, { backgroundColor: colors.accent }]}>
              {user?.photoUri ? (
                <Image source={{ uri: user.photoUri }} style={s.avatarImg} />
              ) : (
                <Text style={s.avatarText}>{initial}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Skipped Banner ────────────────────────── */}
        {wasSkipped && (
          <TouchableOpacity
            onPress={() => { useOnboardingStore.getState().resetOnboarding(); }}
            style={[s.skippedBanner, { backgroundColor: `${colors.warning}15`, borderColor: colors.warning }]}
          >
            <Ionicons name="alert-circle" size={18} color={colors.warning} />
            <Text style={[s.skippedText, { color: colors.warning }]}>Profile uses defaults. Tap to customize your roadmap.</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.warning} />
          </TouchableOpacity>
        )}

        {/* ── Featured AI Card ──────────────────────── */}
        <Card variant="dark" delay={0}>
          <View style={s.featuredRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.featuredTitle}>AI Startup Advisor</Text>
              <Text style={s.featuredSub}>Get personalized guidance for your {fmt(startupProfile.startupType)} startup</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Chat')}
                style={[s.featuredBtn, { backgroundColor: colors.accent }]}
              >
                <Ionicons name="chatbubble-ellipses" size={16} color="#FFF" />
                <Text style={s.featuredBtnText}>Talk to FounderAI</Text>
              </TouchableOpacity>
            </View>
            <View style={[s.featuredIconWrap, { backgroundColor: `${colors.accent}20` }]}>
              <Ionicons name="sparkles" size={36} color={colors.accent} />
            </View>
          </View>
        </Card>

        {/* ── Two Side-by-Side Cards ────────────────── */}
        <View style={s.dualRow}>
          <View style={{ flex: 1 }}>
            <Card delay={100}>
              <Text style={[s.miniLabel, { color: colors.textMuted }]}>PROGRESS</Text>
              <Text style={[s.miniVal, { color: colors.textPrimary }]}>{progress}%</Text>
              <ProgressBar progress={progress} showPercentage={false} color={colors.accent} height={6} />
              <Text style={[s.miniHint, { color: colors.textMuted }]}>{doneTasks}/{totalTasks} tasks</Text>
            </Card>
          </View>
          <View style={{ flex: 1 }}>
            <Card delay={150}>
              <Text style={[s.miniLabel, { color: colors.textMuted }]}>READINESS</Text>
              <Text style={[s.miniVal, { color: colors.accent }]}>{riskScores.overallReadiness}<Text style={[s.miniOf, { color: colors.textMuted }]}>/100</Text></Text>
              <ProgressBar progress={riskScores.overallReadiness} showPercentage={false} color={riskScores.overallReadiness >= 70 ? colors.success : colors.accent} height={6} />
              <Text style={[s.miniHint, { color: colors.textMuted }]}>Market score</Text>
            </Card>
          </View>
        </View>

        {/* ── Startup Summary ───────────────────────── */}
        <Card title="About Your Startup" delay={200}>
          <View style={s.grid}>
            {[
              { label: 'Type', val: fmt(startupProfile.startupType), icon: 'briefcase' as const },
              { label: 'Goal', val: fmt(startupProfile.goal), icon: 'bullseye-arrow' as const },
              { label: 'Budget', val: fmt(startupProfile.budgetRange), icon: 'cash' as const },
              { label: 'Phase', val: activePhase?.name || 'N/A', icon: 'flag-checkered' as const },
            ].map(item => (
              <View key={item.label} style={[s.gridItem, { backgroundColor: colors.divider }]}>
                <MaterialCommunityIcons name={item.icon} size={18} color={colors.accent} />
                <Text style={[s.gridLabel, { color: colors.textMuted }]}>{item.label}</Text>
                <Text style={[s.gridVal, { color: colors.textPrimary }]}>{item.val}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* ── Topic Pills ───────────────────────────── */}
        <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>Roadmap Phases</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.topicScroll} contentContainerStyle={s.topicContent}>
          {topicIcons.map((t) => {
            const phase = roadmap.phases.find(p => p.name === t.phase);
            const isActive = phase?.status === 'in_progress';
            const isDone = phase?.status === 'completed';
            return (
              <TouchableOpacity key={t.name} onPress={() => navigation.navigate('Roadmap')} style={s.topicItem}>
                <View style={[s.topicCircle, { backgroundColor: isActive ? colors.accent : isDone ? colors.success : colors.surface, borderColor: isActive ? colors.accent : colors.border }]}>
                  <MaterialCommunityIcons name={t.icon} size={22} color={isActive || isDone ? '#FFFFFF' : colors.textMuted} />
                </View>
                <Text style={[s.topicName, { color: isActive ? colors.accent : colors.textMuted }]}>{t.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Risk Assessment ───────────────────────── */}
        <Card title="Risk Assessment" delay={300}>
          <View style={s.riskRow}>
            <RiskGauge label="Budget" score={riskScores.budgetRisk} />
            <RiskGauge label="Skills" score={riskScores.skillGapRisk} />
            <RiskGauge label="Market" score={riskScores.marketComplexity} />
          </View>
        </Card>

        {/* ── Chat Hint ─────────────────────────────── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          style={[s.chatHint, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="sparkles" size={16} color={colors.accent} />
          <Text style={[s.chatHintText, { color: colors.textMuted }]}>Ask FounderAI anything...</Text>
          <Ionicons name="send" size={16} color={colors.accent} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  greeting: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  headerSub: { fontSize: FontSize.sm, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  themeBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: FontWeight.bold, color: '#FFFFFF' },
  avatarImg: { width: 44, height: 44, borderRadius: 22 },

  // Empty
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: Spacing.md, marginBottom: Spacing.sm },
  emptySub: { fontSize: FontSize.md, textAlign: 'center' },

  // Skipped banner
  skippedBanner: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, marginBottom: Spacing.md, gap: Spacing.xs },
  skippedText: { flex: 1, fontSize: FontSize.xs, fontWeight: FontWeight.medium },

  // Featured AI card
  featuredRow: { flexDirection: 'row', alignItems: 'center' },
  featuredTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFFFFF', marginBottom: 4 },
  featuredSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.md, lineHeight: 20 },
  featuredBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.full, alignSelf: 'flex-start', gap: 6 },
  featuredBtnText: { color: '#FFFFFF', fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  featuredIconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.md },

  // Dual cards
  dualRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xs },
  miniLabel: { fontSize: FontSize.xs, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: FontWeight.bold, marginBottom: 4 },
  miniVal: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
  miniOf: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  miniHint: { fontSize: FontSize.xs, marginTop: Spacing.xs },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  gridItem: { width: '47%', padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  gridLabel: { fontSize: FontSize.xs, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  gridVal: { fontSize: FontSize.sm, fontWeight: FontWeight.semiBold, marginTop: 2 },

  // Section title
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.sm, marginTop: Spacing.xs },

  // Topic pills
  topicScroll: { marginBottom: Spacing.md },
  topicContent: { gap: Spacing.lg, paddingRight: Spacing.md },
  topicItem: { alignItems: 'center', width: 64 },
  topicCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: Spacing.xs },
  topicName: { fontSize: FontSize.xs - 1, fontWeight: FontWeight.medium, textAlign: 'center' },

  // Risk
  riskRow: { flexDirection: 'row', justifyContent: 'space-around' },

  // Chat hint
  chatHint: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.full, borderWidth: 1, gap: Spacing.sm, marginTop: Spacing.sm },
  chatHintText: { flex: 1, fontSize: FontSize.sm },
});
