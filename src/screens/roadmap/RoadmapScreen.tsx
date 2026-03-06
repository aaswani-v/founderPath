import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Card, ProgressBar, ConvertibleCost } from '../../components';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors, useThemeStore } from '../../theme';
import { useRoadmapStore } from '../../store';
import { PhaseStatus } from '../../models';
import { useNavigation } from '@react-navigation/native';

const STATUS_LABELS: Record<PhaseStatus, string> = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };

export const RoadmapScreen: React.FC = () => {
  const { roadmap, updateTaskStatus } = useRoadmapStore();
  const colors = useThemeColors();
  const { isDark, toggleTheme } = useThemeStore();
  const navigation = useNavigation<any>();
  const [expandedPhase, setExpandedPhase] = useState<string | null>(roadmap?.phases.find(p => p.status === 'in_progress')?.id || null);

  const statusColor = (s: PhaseStatus) => s === 'completed' ? colors.accent : s === 'in_progress' ? colors.accentSoft : colors.statusPending;

  if (!roadmap) {
    return (
      <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
        <View style={st.emptyState}>
          <Ionicons name="map-outline" size={64} color={colors.textMuted} />
          <Text style={[st.emptyTitle, { color: colors.textPrimary }]}>No Roadmap Generated</Text>
        </View>
      </SafeAreaView>
    );
  }

  const cycleStatus = (phaseId: string, taskId: string, cur: PhaseStatus) => {
    const next: Record<PhaseStatus, PhaseStatus> = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
    updateTaskStatus(phaseId, taskId, next[cur]);
  };

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={st.headerRow}>
          <Text style={[st.title, { color: colors.textPrimary }]}>Your Roadmap</Text>
          <TouchableOpacity onPress={toggleTheme} style={[st.themeBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>
        <Text style={[st.subtitle, { color: colors.textMuted }]}>Tap a phase to expand • Tap a task to update</Text>

        <TouchableOpacity 
          style={[st.govLinkBtn, { backgroundColor: `${colors.accent}15` }]}
          onPress={() => Linking.openURL('https://www.startupindia.gov.in/')}
        >
          <Ionicons name="document-text-outline" size={16} color={colors.accent} />
          <Text style={[st.govLinkText, { color: colors.accent }]}>Apply on Startup India Portal</Text>
        </TouchableOpacity>

        {roadmap.phases.map((phase, idx) => {
          const isOpen = expandedPhase === phase.id;
          return (
            <View key={phase.id}>
              {idx > 0 && (
                <View style={st.connector}>
                  <View style={[st.connectorLine, { backgroundColor: phase.status !== 'pending' ? colors.accent : colors.border }]} />
                </View>
              )}

              <TouchableOpacity onPress={() => setExpandedPhase(isOpen ? null : phase.id)} activeOpacity={0.7}>
                <Card variant={phase.status === 'in_progress' ? 'dark' : 'default'} delay={idx * 80}>
                  <View style={st.phaseHeader}>
                    <View style={st.phaseInfo}>
                      <View style={st.phaseTitleRow}>
                        <View style={[st.dot, { backgroundColor: statusColor(phase.status) }]} />
                        <Text style={[st.phaseName, { color: phase.status === 'in_progress' ? colors.textLight : colors.textPrimary }]}>{phase.name}</Text>
                      </View>
                      <Text style={[st.phaseDesc, { color: phase.status === 'in_progress' ? 'rgba(255,255,255,0.6)' : colors.textSecondary }]}>{phase.description}</Text>
                    </View>
                    <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
                  </View>

                  <View style={st.meta}>
                    <View style={st.metaItem}>
                      <Ionicons name="cash-outline" size={14} color={phase.status === 'in_progress' ? 'rgba(255,255,255,0.4)' : colors.textMuted} />
                      <ConvertibleCost costLow={phase.costLow} costHigh={phase.costHigh} style={{ color: phase.status === 'in_progress' ? colors.textLight : colors.textPrimary }} />
                    </View>
                    {[
                      { icon: 'time-outline' as const, val: phase.estimatedTimeline },
                      { icon: 'flag-outline' as const, val: STATUS_LABELS[phase.status] },
                    ].map(m => (
                      <View key={m.icon} style={st.metaItem}>
                        <Ionicons name={m.icon} size={14} color={phase.status === 'in_progress' ? 'rgba(255,255,255,0.4)' : colors.textMuted} />
                        <Text style={[st.metaVal, { color: m.icon === 'flag-outline' ? statusColor(phase.status) : phase.status === 'in_progress' ? colors.textLight : colors.textPrimary }]}>{m.val}</Text>
                      </View>
                    ))}
                  </View>

                  <ProgressBar progress={phase.completionPercentage} showPercentage color={colors.accent} height={6} style={{ marginTop: Spacing.sm }} />
                </Card>
              </TouchableOpacity>

              {isOpen && (
                <View style={[st.taskList, { borderLeftColor: colors.border }]}>
                  {phase.tasks.map(task => (
                    <TouchableOpacity key={task.id} style={[st.taskItem, { backgroundColor: colors.surface }]} onPress={() => cycleStatus(phase.id, task.id, task.status)} activeOpacity={0.7}>
                      <View style={[st.taskBar, { backgroundColor: statusColor(task.status) }]} />
                      <View style={st.taskContent}>
                        <Text style={[st.taskTitle, { color: colors.textPrimary }, task.status === 'completed' && { textDecorationLine: 'line-through', color: colors.textMuted }]}>{task.title}</Text>
                        <Text style={[st.taskDesc, { color: colors.textSecondary }]}>{task.description}</Text>
                        <View style={st.taskMeta}>
                          <View style={st.taskMetaItem}><Ionicons name="cash-outline" size={12} color={colors.textMuted} /><ConvertibleCost costLow={task.costLow} costHigh={task.costHigh} style={{ color: colors.textMuted }} /></View>
                          <View style={st.taskMetaItem}><Ionicons name="time-outline" size={12} color={colors.textMuted} /><Text style={[st.taskMetaText, { color: colors.textMuted }]}>{task.estimatedTime}</Text></View>
                          <TouchableOpacity
                            onPress={() => navigation.navigate('Chat')}
                            style={[st.askAiBtn, { backgroundColor: `${colors.accent}20` }]}
                          >
                            <Ionicons name="sparkles" size={12} color={colors.accent} />
                            <Text style={[st.askAiText, { color: colors.accent }]}>Ask AI</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  themeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  subtitle: { fontSize: FontSize.sm, marginBottom: Spacing.lg },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: Spacing.md },
  govLinkBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, alignSelf: 'flex-start', marginBottom: Spacing.lg, gap: Spacing.xs },
  govLinkText: { fontSize: FontSize.sm, fontWeight: FontWeight.semiBold },
  connector: { alignItems: 'center', marginBottom: -Spacing.sm, height: 20 },
  connectorLine: { width: 2, height: 20 },
  phaseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  phaseInfo: { flex: 1 },
  phaseTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  phaseName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  phaseDesc: { fontSize: FontSize.sm, marginTop: Spacing.xs, marginLeft: Spacing.lg + Spacing.xs },
  meta: { flexDirection: 'row', marginTop: Spacing.md, gap: Spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaVal: { fontSize: FontSize.sm, fontWeight: FontWeight.semiBold },
  taskList: { marginTop: Spacing.sm, marginLeft: Spacing.md, borderLeftWidth: 2, paddingLeft: Spacing.md },
  taskItem: { flexDirection: 'row', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  taskBar: { width: 4, borderRadius: 2, marginRight: Spacing.md },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semiBold },
  taskDesc: { fontSize: FontSize.xs, marginTop: 2 },
  taskMeta: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  taskMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  taskMetaText: { fontSize: FontSize.xs },
  askAiBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.full },
  askAiText: { fontSize: FontSize.xs, fontWeight: FontWeight.semiBold },
});
