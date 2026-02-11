import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Card, ProgressBar, OptionCard, Button } from '../../components';
import { Spacing, FontSize, FontWeight, useThemeColors } from '../../theme';
import { useRoadmapStore } from '../../store';
import { ExpansionType } from '../../models';

const CHECKLIST = [
  { id: '1', text: 'Market research completed', icon: 'magnify' as const },
  { id: '2', text: 'Regulatory requirements identified', icon: 'gavel' as const },
  { id: '3', text: 'Localization strategy defined', icon: 'translate' as const },
  { id: '4', text: 'Distribution channels identified', icon: 'truck-delivery' as const },
  { id: '5', text: 'Financial model updated', icon: 'calculator' as const },
  { id: '6', text: 'Team capacity assessed', icon: 'account-group' as const },
];

export const ExpansionScreen: React.FC = () => {
  const { isExpansionMode, setExpansionMode } = useRoadmapStore();
  const colors = useThemeColors();
  const [expansionType, setExpansionType] = useState<ExpansionType>('same_market');
  const [teamSize, setTeamSize] = useState(5);
  const [checked, setChecked] = useState<string[]>([]);

  const readinessScore = Math.round((checked.length / CHECKLIST.length) * 100);
  const toggleCheck = (id: string) => setChecked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const risks = [
    { label: 'Market Entry Risk', value: expansionType === 'new_market' ? 72 : 35 },
    { label: 'Resource Strain', value: teamSize < 5 ? 68 : 30 },
    { label: 'Competitive Pressure', value: 55 },
  ];

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[s.title, { color: colors.textPrimary }]}>Market Expansion</Text>
        <Text style={[s.subtitle, { color: colors.textMuted }]}>Plan your growth into new or existing markets</Text>

        <Card delay={0}>
          <View style={s.toggleRow}>
            <View style={s.toggleLabel}>
              <Ionicons name="globe" size={20} color={colors.accent} style={{ marginRight: 8 }} />
              <Text style={[s.toggleText, { color: colors.textPrimary }]}>Expansion Mode</Text>
            </View>
            <Switch
              value={isExpansionMode}
              onValueChange={setExpansionMode}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>
        </Card>

        {isExpansionMode && (
          <>
            <Card title="Expansion Type" delay={80}>
              <OptionCard label="Same Market" description="Expand within your current market" iconName="map-marker-radius" selected={expansionType === 'same_market'} onPress={() => setExpansionType('same_market')} />
              <OptionCard label="New Market" description="Enter a completely new market" iconName="earth" selected={expansionType === 'new_market'} onPress={() => setExpansionType('new_market')} />
            </Card>

            <Card title="Team Size" delay={160}>
              <View style={s.teamRow}>
                {[1, 3, 5, 10, 20].map(size => (
                  <Button key={size} title={`${size}${size === 20 ? '+' : ''}`} onPress={() => setTeamSize(size)} variant={teamSize === size ? 'primary' : 'outline'} size="sm" style={s.teamBtn} />
                ))}
              </View>
            </Card>

            <Card title="Risk Indicators" variant="dark" delay={240}>
              {risks.map(r => (
                <View key={r.label} style={s.riskItem}>
                  <ProgressBar progress={r.value} label={r.label} color={r.value > 60 ? colors.accentSoft : r.value > 35 ? colors.accent : colors.success} height={6} />
                </View>
              ))}
            </Card>

            <Card title="Strategy Checklist" delay={320}>
              {CHECKLIST.map(item => (
                <TouchableOpacity key={item.id} style={[s.checkRow, { borderBottomColor: colors.divider }]} onPress={() => toggleCheck(item.id)} activeOpacity={0.7}>
                  <View style={[s.checkbox, { borderColor: checked.includes(item.id) ? colors.accent : colors.border, backgroundColor: checked.includes(item.id) ? colors.accent : 'transparent' }]}>
                    {checked.includes(item.id) && <Ionicons name="checkmark" size={14} color={colors.surfaceDark} />}
                  </View>
                  <MaterialCommunityIcons name={item.icon} size={18} color={checked.includes(item.id) ? colors.accent : colors.textMuted} style={{ marginRight: 8 }} />
                  <Text style={[s.checkText, { color: checked.includes(item.id) ? colors.textPrimary : colors.textSecondary }]}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </Card>

            <Card title="Expansion Readiness" variant="dark" delay={400}>
              <View style={s.readRow}>
                <Text style={[s.readScore, { color: colors.accent }]}>{readinessScore}</Text>
                <Text style={s.readOf}>/ 100</Text>
              </View>
              <ProgressBar progress={readinessScore} showPercentage={false} color={colors.accent} height={8} />
              <Text style={s.readHint}>
                {readinessScore >= 70 ? "You're well-prepared for expansion!" : readinessScore >= 40 ? 'Some areas still need attention.' : 'Complete the checklist above to improve your readiness.'}
              </Text>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, marginBottom: Spacing.lg },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { flexDirection: 'row', alignItems: 'center' },
  toggleText: { fontSize: FontSize.md, fontWeight: FontWeight.semiBold },
  teamRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  teamBtn: { minWidth: 48 },
  riskItem: { marginBottom: Spacing.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  checkText: { fontSize: FontSize.sm, flex: 1 },
  readRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: Spacing.md },
  readScore: { fontSize: 48, fontWeight: FontWeight.bold },
  readOf: { fontSize: FontSize.lg, color: 'rgba(255,255,255,0.5)', marginLeft: Spacing.xs },
  readHint: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.md, lineHeight: 20 },
});
