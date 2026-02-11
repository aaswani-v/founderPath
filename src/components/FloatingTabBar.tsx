import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors, useThemeStore } from '../theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_CONFIG: Record<string, { label: string; icon: IconName; activeIcon: IconName }> = {
  Dashboard: { label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  Roadmap: { label: 'Roadmap', icon: 'map-outline', activeIcon: 'map' },
  Chat: { label: 'AI Chat', icon: 'chatbubble-ellipses-outline', activeIcon: 'chatbubble-ellipses' },
  Transparency: { label: 'Insights', icon: 'sparkles-outline', activeIcon: 'sparkles' },
  Expansion: { label: 'Expand', icon: 'globe-outline', activeIcon: 'globe' },
};

const TabItem: React.FC<{
  label: string;
  icon: IconName;
  activeIcon: IconName;
  focused: boolean;
  isCenter: boolean;
  onPress: () => void;
}> = ({ label, icon, activeIcon, focused, isCenter, onPress }) => {
  const colors = useThemeColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: true, speed: 50, bounciness: 4 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }),
    ]).start();
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: -4, duration: 100, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 0, useNativeDriver: true, speed: 30, bounciness: 10 }),
    ]).start();
    onPress();
  };

  // Center AI Chat button gets special styling
  if (isCenter) {
    return (
      <Animated.View style={[styles.tabItem, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.tabTouchable}>
          <Animated.View style={[styles.centerBtn, { backgroundColor: colors.accent, transform: [{ translateY: bounceAnim }] }]}>
            <Ionicons name={focused ? activeIcon : icon} size={22} color="#FFFFFF" />
          </Animated.View>
          <Text style={[styles.tabLabel, { color: focused ? colors.accent : colors.textMuted }, focused && styles.tabLabelActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.tabItem, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.tabTouchable}>
        {focused && <View style={[styles.activeIndicator, { backgroundColor: colors.accent }]} />}
        <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
          <Ionicons name={focused ? activeIcon : icon} size={21} color={focused ? colors.accent : colors.textMuted} />
        </Animated.View>
        <Text style={[styles.tabLabel, { color: focused ? colors.accent : colors.textMuted }, focused && styles.tabLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const colors = useThemeColors();
  const { isDark } = useThemeStore();

  const glassBg = isDark ? 'rgba(26, 23, 38, 0.75)' : 'rgba(255, 255, 255, 0.72)';
  const glassBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(49, 44, 81, 0.08)';

  return (
    <View style={styles.floatingContainer}>
      <View style={[styles.tabBar, { backgroundColor: glassBg, borderColor: glassBorder, shadowColor: colors.cardShadow }]}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) return null;
          const focused = state.index === index;
          const isCenter = route.name === 'Chat';

          return (
            <TabItem
              key={route.key}
              label={config.label}
              icon={config.icon}
              activeIcon={config.activeIcon}
              focused={focused}
              isCenter={isCenter}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: '100%',
    maxWidth: 440,
    ...Platform.select({
      web: { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' } as any,
    }),
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabTouchable: { alignItems: 'center', paddingVertical: Spacing.xs, paddingHorizontal: 4 },
  activeIndicator: { position: 'absolute', top: -2, width: 18, height: 3, borderRadius: 2 },
  centerBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginTop: -10, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  tabLabel: { fontSize: 10, fontWeight: FontWeight.medium, marginTop: 2 },
  tabLabelActive: { fontWeight: FontWeight.bold },
});
