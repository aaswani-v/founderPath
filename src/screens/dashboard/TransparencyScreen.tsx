import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors } from '../../theme';
import { useRoadmapStore } from '../../store';
import { decisionEngine, aiExplanationService } from '../../services';

const fmt = (v: string) => v.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

export const TransparencyScreen: React.FC = () => {
  const { startupProfile } = useRoadmapStore();
  const colors = useThemeColors();
  const [aiSummary, setAiSummary] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!startupProfile) return;
    (async () => {
      setLoading(true);
      const [summary, recs] = await Promise.all([
        aiExplanationService.getExplanation(startupProfile),
        aiExplanationService.getRecommendations(startupProfile),
      ]);
      setAiSummary(summary);
      setRecommendations(recs);
      setLoading(false);
    })();
  }, [startupProfile]);

  if (!startupProfile) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
        <View style={s.emptyState}>
          <Ionicons name="search-outline" size={64} color={colors.textMuted} />
          <Text style={[s.emptyTitle, { color: colors.textPrimary }]}>No Data Available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const explanations = decisionEngine.generateExplanation(startupProfile);

  type ConstraintItem = { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; val: string };
  const constraints: ConstraintItem[] = [
    { icon: 'account', label: 'Founder', val: fmt(startupProfile.founderType) },
    { icon: 'briefcase', label: 'Type', val: fmt(startupProfile.startupType) },
    { icon: 'bullseye-arrow', label: 'Goal', val: fmt(startupProfile.goal) },
    { icon: 'cash', label: 'Budget', val: fmt(startupProfile.budgetRange) },
    { icon: 'code-braces', label: 'Technical', val: startupProfile.hasTechnicalBackground ? 'Yes' : 'No' },
    { icon: 'earth', label: 'Market', val: startupProfile.marketType.toUpperCase() },
  ];

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[s.title, { color: colors.textPrimary }]}>Why This Roadmap?</Text>
        <Text style={[s.subtitle, { color: colors.textMuted }]}>Full transparency into how your roadmap was generated</Text>

        <Card title="Your Constraints" delay={0}>
          <View style={s.constraintGrid}>
            {constraints.map((c: ConstraintItem) => (
              <View key={c.label} style={[s.constraintItem, { backgroundColor: colors.divider }]}>
                <MaterialCommunityIcons name={c.icon} size={18} color={colors.accent} />
                <Text style={[s.constraintLabel, { color: colors.textMuted }]}>{c.label}</Text>
                <Text style={[s.constraintVal, { color: colors.textPrimary }]}>{c.val}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card title="Decision Logic" variant="dark" delay={100}>
          {explanations.map((exp: string, i: number) => (
            <View key={i} style={s.logicItem}>
              <Ionicons name="caret-forward" size={16} color={colors.accent} style={{ marginTop: 2 }} />
              <Text style={s.logicText}>{exp}</Text>
            </View>
          ))}
        </Card>

        <Card title="AI Summary" delay={200}>
          {loading ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <View style={[s.aiBox, { backgroundColor: `${colors.accent}10`, borderLeftColor: colors.accent }]}>
              <Ionicons name="sparkles" size={18} color={colors.accent} style={{ marginRight: 8 }} />
              <Text style={[s.aiText, { color: colors.textPrimary }]}>{aiSummary}</Text>
            </View>
          )}
        </Card>

        <Card title="Recommendations" delay={300}>
          {loading ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            recommendations.map((rec: string, i: number) => (
              <View key={i} style={[s.recItem, { borderBottomColor: colors.divider }]}>
                <View style={[s.recNum, { backgroundColor: colors.accent }]}>
                  <Text style={[s.recNumText, { color: colors.surfaceDark }]}>{i + 1}</Text>
                </View>
                <Text style={[s.recText, { color: colors.textPrimary }]}>{rec}</Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, marginBottom: Spacing.lg },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: Spacing.md },
  constraintGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  constraintItem: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, width: '48%', alignItems: 'center' },
  constraintLabel: { fontSize: FontSize.xs, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: Spacing.xs },
  constraintVal: { fontSize: FontSize.sm, fontWeight: FontWeight.semiBold, marginTop: 2 },
  logicItem: { flexDirection: 'row', marginBottom: Spacing.md, paddingRight: Spacing.md },
  logicText: { flex: 1, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginLeft: Spacing.sm, lineHeight: 20 },
  aiBox: { borderLeftWidth: 3, padding: Spacing.md, borderRadius: BorderRadius.sm, flexDirection: 'row', alignItems: 'flex-start' },
  aiText: { flex: 1, fontSize: FontSize.sm, lineHeight: 22 },
  recItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1 },
  recNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  recNumText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  recText: { flex: 1, fontSize: FontSize.sm, lineHeight: 20 },
});
