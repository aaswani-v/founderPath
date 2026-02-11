import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, OptionCard, ProgressBar } from '../../components';
import { Spacing, FontSize, FontWeight, useThemeColors } from '../../theme';
import { useOnboardingStore, useRoadmapStore } from '../../store';
import { FounderType, StartupType, GoalType, BudgetRange, MarketType, StartupProfile } from '../../models';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = { navigation: NativeStackNavigationProp<any> };

const STEPS = [
  {
    title: 'What describes you best?',
    subtitle: 'This helps us tailor your roadmap',
    key: 'founderType' as const,
    options: [
      { value: 'student', label: 'Student Founder', icon: 'school' as const, description: 'Building while studying' },
      { value: 'working_professional', label: 'Working Professional', icon: 'briefcase' as const, description: 'Side project or transitioning' },
      { value: 'experienced', label: 'Experienced Founder', icon: 'rocket-launch' as const, description: 'Serial entrepreneur or industry veteran' },
    ],
  },
  {
    title: 'What are you building?',
    subtitle: 'Choose your startup model',
    key: 'startupType' as const,
    options: [
      { value: 'saas', label: 'SaaS', icon: 'cloud' as const, description: 'Software as a Service' },
      { value: 'ecommerce', label: 'E-Commerce', icon: 'cart' as const, description: 'Online retail or marketplace' },
      { value: 'service', label: 'Service', icon: 'handshake' as const, description: 'Consulting, agency, or freelance' },
      { value: 'marketplace', label: 'Marketplace', icon: 'store' as const, description: 'Two-sided platform' },
    ],
  },
  {
    title: "What's your primary goal?",
    subtitle: 'Where are you in your journey?',
    key: 'goal' as const,
    options: [
      { value: 'build_mvp', label: 'Build MVP', icon: 'hammer-wrench' as const, description: 'Create the first version' },
      { value: 'launch', label: 'Launch', icon: 'bullseye-arrow' as const, description: 'Go to market' },
      { value: 'scale', label: 'Scale', icon: 'chart-line' as const, description: 'Grow an existing product' },
      { value: 'expand', label: 'Expand', icon: 'earth' as const, description: 'Enter new markets' },
    ],
  },
  {
    title: "What's your budget range?",
    subtitle: 'Be honest — your roadmap adapts to this',
    key: 'budgetRange' as const,
    options: [
      { value: 'very_low', label: 'Very Low', icon: 'currency-usd' as const, description: 'Under $500' },
      { value: 'low', label: 'Low', icon: 'cash' as const, description: '$500 – $2,000' },
      { value: 'medium', label: 'Medium', icon: 'cash-multiple' as const, description: '$2,000 – $10,000' },
      { value: 'high', label: 'High', icon: 'finance' as const, description: '$10,000+' },
    ],
  },
  {
    title: 'Do you have a technical background?',
    subtitle: 'Can you build the product yourself?',
    key: 'hasTechnicalBackground' as const,
    options: [
      { value: true, label: 'Yes', icon: 'code-braces' as const, description: 'I can code or have deep tech skills' },
      { value: false, label: 'No', icon: 'clipboard-text' as const, description: "I'll need technical help" },
    ],
  },
  {
    title: "Who's your target market?",
    subtitle: 'This affects your go-to-market strategy',
    key: 'marketType' as const,
    options: [
      { value: 'b2b', label: 'B2B', icon: 'office-building' as const, description: 'Selling to businesses' },
      { value: 'b2c', label: 'B2C', icon: 'account-group' as const, description: 'Selling to consumers' },
    ],
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { currentStep, totalSteps, answers, setFounderType, setStartupType, setGoal, setBudgetRange, setTechnicalBackground, setMarketType, nextStep, prevStep, completeOnboarding } = useOnboardingStore();
  const { generateRoadmap } = useRoadmapStore();
  const colors = useThemeColors();
  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const getCurrentValue = () => answers[step.key];

  const handleSelect = (value: any) => {
    switch (step.key) {
      case 'founderType': setFounderType(value as FounderType); break;
      case 'startupType': setStartupType(value as StartupType); break;
      case 'goal': setGoal(value as GoalType); break;
      case 'budgetRange': setBudgetRange(value as BudgetRange); break;
      case 'hasTechnicalBackground': setTechnicalBackground(value as boolean); break;
      case 'marketType': setMarketType(value as MarketType); break;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      nextStep();
    } else {
      const profile: StartupProfile = {
        founderType: answers.founderType!, startupType: answers.startupType!, goal: answers.goal!,
        budgetRange: answers.budgetRange!, hasTechnicalBackground: answers.hasTechnicalBackground!, marketType: answers.marketType!,
      };
      generateRoadmap(profile);
      completeOnboarding();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} label={`Step ${currentStep + 1} of ${totalSteps}`} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{step.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{step.subtitle}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {step.options.map((option) => (
            <OptionCard
              key={String(option.value)}
              label={option.label}
              description={option.description}
              iconName={option.icon}
              selected={getCurrentValue() === option.value}
              onPress={() => handleSelect(option.value)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={[styles.navigation, { borderTopColor: colors.divider }]}>
        {currentStep > 0 && <Button title="Back" onPress={prevStep} variant="outline" style={styles.backButton} />}
        <Button title={currentStep === totalSteps - 1 ? 'Generate Roadmap' : 'Continue'} onPress={handleNext} disabled={getCurrentValue() === undefined} style={currentStep === 0 ? { flex: 1 } : styles.nextButton} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressContainer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  content: { flexGrow: 1, padding: Spacing.lg },
  questionContainer: { marginBottom: Spacing.xl },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSize.md },
  optionsContainer: { gap: Spacing.sm },
  navigation: { flexDirection: 'row', padding: Spacing.lg, gap: Spacing.md, borderTopWidth: 1 },
  backButton: { flex: 0.4 },
  nextButton: { flex: 0.6 },
});
