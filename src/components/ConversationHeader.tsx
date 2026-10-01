import { ChevronLeft, Ellipsis, WifiOff } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Persona } from '../domain/personas';
import type { Mode } from '../state/conversationStore';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { Avatar } from './Avatar';
import { IconButton } from './Button';
import { CONTENT_MAX_WIDTH } from './layout';

type Props = {
  persona: Persona;
  mode: Mode;
  isOnline: boolean;
  isTyping: boolean;
  chartOwner: string | null;
  onBack: () => void;
  onProfilePress: () => void;
  onModeChange: (mode: Mode) => void;
  onMenuPress: () => void;
};

const MODES: { value: Mode; label: string }[] = [
  { value: 'demo', label: 'Demo' },
  { value: 'live', label: 'Live' },
];

export function ConversationHeader(props: Props) {
  const { persona, mode, isOnline, isTyping, chartOwner } = props;
  const insets = useSafeAreaInsets();

  const status = !isOnline
    ? 'Offline'
    : isTyping
      ? 'Typing…'
      : chartOwner
        ? `Reading ${chartOwner}’s chart`
        : 'AI astrologer, online';

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 10 }]}>
      <View style={styles.inner}>
        <IconButton onPress={props.onBack} accessibilityLabel="All astrologers" tone="clear" size={36}>
          <ChevronLeft size={24} color={colors.text} strokeWidth={1.75} />
        </IconButton>

        <Pressable
          onPress={props.onProfilePress}
          accessibilityRole="button"
          accessibilityLabel={`${persona.name}'s profile`}
          style={({ pressed }) => [styles.identity, pressed && styles.pressed]}
        >
          <Avatar source={persona.avatar} ring={persona.theme.accent} size={40} online={isOnline} />
          <View style={styles.titles}>
            <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
              {persona.name}
            </Text>
            <Text style={[styles.status, isTyping && isOnline && { color: persona.theme.accent }]} numberOfLines={1}>
              {status}
            </Text>
          </View>
        </Pressable>

        <View style={styles.modes} accessibilityRole="tablist">
          {MODES.map(({ value, label }) => {
            const selected = mode === value;
            return (
              <Pressable
                key={value}
                onPress={() => props.onModeChange(value)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                style={[styles.mode, selected && styles.modeSelected]}
              >
                {value === 'live' ? <View style={[styles.liveDot, selected && styles.liveDotOn]} /> : null}
                <Text style={[styles.modeText, selected && styles.modeTextSelected]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <IconButton onPress={props.onMenuPress} accessibilityLabel="Session options" size={36}>
          <Ellipsis size={18} color={colors.text} strokeWidth={1.75} />
        </IconButton>
      </View>

      {!isOnline ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.banner}>
          <WifiOff size={15} color={colors.danger} strokeWidth={1.75} />
          <Text style={styles.bannerText}>You’re offline. Messages will fail until you reconnect.</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  titles: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 25,
    color: colors.text,
  },
  status: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  modes: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  mode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
  },
  modeSelected: {
    backgroundColor: colors.accentSoft,
  },
  modeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  modeTextSelected: {
    color: colors.accent,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
    backgroundColor: colors.faint,
  },
  liveDotOn: {
    backgroundColor: colors.online,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.dangerTint,
  },
  bannerText: {
    flexShrink: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.danger,
  },
});
