import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors, useThemeStore } from '../../theme';
import { useChatStore } from '../../store';

/* ── Typing Indicator ─────────────────────────────── */
const TypingDots: React.FC = () => {
  const colors = useThemeColors();
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);

  return (
    <View style={[s.typingContainer, { backgroundColor: colors.surface }]}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            s.typingDot,
            { backgroundColor: colors.accent, opacity: dot, transform: [{ scale: Animated.add(0.6, Animated.multiply(dot, 0.4)) }] },
          ]}
        />
      ))}
    </View>
  );
};

/* ── Chat Screen ──────────────────────────────────── */
export const ChatScreen: React.FC = () => {
  const { messages, isTyping, sendMessage, clearChat } = useChatStore();
  const colors = useThemeColors();
  const { isDark } = useThemeStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const glassBg = isDark ? 'rgba(26, 23, 38, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const glassBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(49, 44, 81, 0.08)';

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || isTyping) return;
    setInput('');
    await sendMessage(msg);
  };

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages.length, isTyping]);

  const renderMarkdown = (text: string): React.ReactNode[] => {
    return text.split('\n').map((line, i) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: React.ReactNode[] = [];
      let lastIdx = 0;
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIdx) parts.push(line.slice(lastIdx, match.index));
        parts.push(
          <Text key={`b${i}_${match.index}`} style={{ fontWeight: FontWeight.bold }}>
            {match[1]}
          </Text>
        );
        lastIdx = match.index + match[0].length;
      }
      if (lastIdx < line.length) parts.push(line.slice(lastIdx));
      if (parts.length === 0) parts.push(' ');

      return (
        <Text key={i} style={{ lineHeight: 22 }}>
          {parts}
          {i < text.split('\n').length - 1 ? '\n' : ''}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: colors.divider }]}>
        <View style={[s.botAvatar, { backgroundColor: `${colors.accent}20` }]}>
          <Ionicons name="sparkles" size={18} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.headerTitle, { color: colors.textPrimary }]}>FounderAI</Text>
          <Text style={[s.headerSub, { color: colors.textMuted }]}>
            {isTyping ? 'Typing...' : 'Your startup advisor'}
          </Text>
        </View>
        <TouchableOpacity onPress={clearChat} style={[s.clearBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <ScrollView
          ref={scrollRef}
          style={s.messageList}
          contentContainerStyle={s.messageContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <View key={msg.id} style={[s.msgRow, isBot ? s.msgRowBot : s.msgRowUser]}>
                {isBot && (
                  <View style={[s.msgAvatar, { backgroundColor: `${colors.accent}20` }]}>
                    <Ionicons name="sparkles" size={14} color={colors.accent} />
                  </View>
                )}
                <View
                  style={[
                    s.bubble,
                    isBot
                      ? [s.bubbleBot, { backgroundColor: colors.surface, borderColor: glassBorder }]
                      : [s.bubbleUser, { backgroundColor: colors.accent }],
                  ]}
                >
                  <Text style={[s.bubbleText, { color: isBot ? colors.textPrimary : '#FFFFFF' }]}>
                    {renderMarkdown(msg.content)}
                  </Text>
                </View>
              </View>
            );
          })}
          {isTyping && (
            <View style={[s.msgRow, s.msgRowBot]}>
              <View style={[s.msgAvatar, { backgroundColor: `${colors.accent}20` }]}>
                <Ionicons name="sparkles" size={14} color={colors.accent} />
              </View>
              <TypingDots />
            </View>
          )}
        </ScrollView>

        {/* Input Bar — positioned above floating tab */}
        <View style={[s.inputBarWrap, { backgroundColor: glassBg, borderColor: glassBorder }]}>
          <View style={[s.inputField, { backgroundColor: colors.divider }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask your AI advisor..."
              placeholderTextColor={colors.textMuted}
              style={[s.input, { color: colors.textPrimary }]}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim() || isTyping}
              style={[
                s.sendBtn,
                { backgroundColor: input.trim() && !isTyping ? colors.accent : 'transparent' },
              ]}
            >
              <Ionicons name="send" size={16} color={input.trim() && !isTyping ? '#FFFFFF' : colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    borderBottomWidth: 1,
  },
  botAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  headerSub: { fontSize: FontSize.xs, marginTop: 1 },
  clearBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  messageList: { flex: 1 },
  messageContent: { padding: Spacing.md, paddingBottom: Spacing.lg },
  msgRow: { marginBottom: Spacing.md, flexDirection: 'row', alignItems: 'flex-end' },
  msgRowBot: { justifyContent: 'flex-start' },
  msgRowUser: { justifyContent: 'flex-end' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.xs },
  bubble: { maxWidth: '78%', paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.lg },
  bubbleBot: { borderTopLeftRadius: 4, borderWidth: 1 },
  bubbleUser: { borderTopRightRadius: 4 },
  bubbleText: { fontSize: FontSize.sm },
  typingContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, gap: 6 },
  typingDot: { width: 8, height: 8, borderRadius: 4 },
  inputBarWrap: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: 96,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 18,
    ...Platform.select({
      web: { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 -6px 24px rgba(0,0,0,0.22)' } as any,
    }),
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingLeft: Spacing.md,
    paddingRight: 4,
    minHeight: 46,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: FontSize.sm,
    paddingVertical: Spacing.sm,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
