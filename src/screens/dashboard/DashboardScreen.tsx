import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, ProgressBar, RiskGauge } from '../../components';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors, useThemeStore } from '../../theme';
import { useRoadmapStore, useAuthStore } from '../../store';

type Props = { navigation: NativeStackNavigationProp<any> };

const fmt = (v: string) => v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { roadmap, riskScores, startupProfile } = useRoadmapStore();
  const { user, logout } = useAuthStore();
  const colors = useThemeColors();
  const { isDark, toggleTheme } = useThemeStore();

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

  const totalTasks = roadmap.phases.reduce((n, p) => n + p.tasks.length, 0);
  const doneTasks = roadmap.phases.reduce((n, p) => n + p.tasks.filter(t => t.status === 'completed').length, 0);
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const activePhase = roadmap.phases.find(p => p.status === 'in_progress') || roadmap.phases[0];

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={[s.greeting, { color: colors.textPrimary }]}>Hello, {user?.displayName || 'Founder'}</Text>
            <Text style={[s.headerSub, { color: colors.textSecondary }]}>Here's your startup progress</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity onPress={toggleTheme} style={[s.iconBtn, { backgroundColor: colors.surface }]}>
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={20} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={[s.iconBtn, { backgroundColor: colors.surface }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <Card title="Startup Summary" variant="dark" delay={0}>
          <View style={s.grid}>
            {[
              { label: 'Type', val: fmt(startupProfile.startupType), icon: 'briefcase' as const },
              { label: 'Goal', val: fmt(startupProfile.goal), icon: 'bullseye-arrow' as const },
              { label: 'Budget', val: fmt(startupProfile.budgetRange), icon: 'cash' as const },
              { label: 'Phase', val: activePhase?.name || 'N/A', icon: 'flag-checkered' as const },
            ].map(item => (
              <View key={item.label} style={s.gridItem}>
                <MaterialCommunityIcons name={item.icon} size={16} color="rgba(255,255,255,0.4)" />
                <Text style={s.gridLabel}>{item.label}</Text>
                <Text style={s.gridVal}>{item.val}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Progress */}
        <Card title="Roadmap Progress" delay={100}>
          <ProgressBar progress={progress} label="Overall Completion" color={colors.accent} height={10} />
          <View style={s.chips}>
            {roadmap.phases.map(p => (
              <TouchableOpacity key={p.id} style={[s.chip, { backgroundColor: p.status === 'in_progress' ? colors.accent : p.status === 'completed' ? colors.success : colors.divider }]} onPress={() => navigation.navigate('Roadmap')}>
                <Text style={[s.chipText, { color: p.status !== 'pending' ? colors.surfaceDark : colors.textMuted }]} numberOfLines={1}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Risk */}
        <Card title="Risk Assessment" delay={200}>
          <View style={s.riskRow}>
            <RiskGauge label="Budget Risk" score={riskScores.budgetRisk} />
            <RiskGauge label="Skill Gap" score={riskScores.skillGapRisk} />
            <RiskGauge label="Market" score={riskScores.marketComplexity} />
          </View>
        </Card>

        {/* Readiness */}
        <Card title="Market Readiness" variant="dark" delay={300}>
          <View style={s.readRow}>
            <Text style={s.readScore}>{riskScores.overallReadiness}</Text>
            <Text style={s.readOf}>/ 100</Text>
          </View>
          <ProgressBar progress={riskScores.overallReadiness} showPercentage={false} color={colors.accent} height={8} />
          <Text style={s.readHint}>
            {riskScores.overallReadiness >= 70 ? 'Great potential! Your startup has a strong foundation.' : riskScores.overallReadiness >= 40 ? 'Some areas need attention. Follow your roadmap to improve.' : 'Start with validation. Your roadmap will guide you.'}
          </Text>
        </Card>

        {/* Quick Actions */}
        <View style={s.actions}>
          {[
            { icon: 'map-outline' as const, label: 'Roadmap', nav: 'Roadmap' },
            { icon: 'search-outline' as const, label: 'Why This?', nav: 'Transparency' },
            { icon: 'globe-outline' as const, label: 'Expansion', nav: 'Expansion' },
          ].map(a => (
            <TouchableOpacity key={a.nav} style={[s.actionCard, { backgroundColor: colors.surface }]} onPress={() => navigation.navigate(a.nav)}>
              <Ionicons name={a.icon} size={24} color={colors.accent} />
              <Text style={[s.actionLabel, { color: colors.textPrimary }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  greeting: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  headerSub: { fontSize: FontSize.sm, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: Spacing.md, marginBottom: Spacing.sm },
  emptySub: { fontSize: FontSize.md, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '50%', marginBottom: Spacing.md },
  gridLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  gridVal: { fontSize: FontSize.md, fontWeight: FontWeight.semiBold, color: '#FFFFFF', marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.md, gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  chipText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  riskRow: { flexDirection: 'row', justifyContent: 'space-around' },
  readRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: Spacing.md },
  readScore: { fontSize: 48, fontWeight: FontWeight.bold, color: '#F0C38E' },
  readOf: { fontSize: FontSize.lg, color: 'rgba(255,255,255,0.5)', marginLeft: Spacing.xs },
  readHint: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.md, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: Spacing.md },
  actionCard: { flex: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  actionLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semiBold, textAlign: 'center', marginTop: Spacing.sm },
});
