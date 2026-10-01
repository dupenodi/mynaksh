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
import { CONTENT_MAX_WIDTH, SAFE_TOP_EXTRA } from './layout';

type Props = {
  persona: Persona;
  mode: Mode;
  isOnline: boolean;
  isTyping: boolean;
  chartOwner: string | null;
  onBack: () => void;
  onProfilePress: () => void;
  onMenuPress: () => void;
};

export function ConversationHeader(props: Props) {
  const { persona, mode, isOnline, isTyping, chartOwner } = props;
  const insets = useSafeAreaInsets();
  const status = conversationStatus({ isOnline, isTyping, chartOwner });

  return (
    <View style={[styles.bar, { paddingTop: insets.top + SAFE_TOP_EXTRA }]}>
      <View style={styles.inner}>
        <IconButton onPress={props.onBack} accessibilityLabel="All astrologers" tone="clear" size={32}>
          <ChevronLeft size={20} color={colors.text} strokeWidth={1.75} />
        </IconButton>

        <Pressable
          onPress={props.onProfilePress}
          accessibilityRole="button"
          accessibilityLabel={`${persona.name}'s profile`}
          style={({ pressed }) => [styles.identity, pressed && styles.pressed]}
        >
          <Avatar source={persona.avatar} size={36} online={isOnline} />
          <View style={styles.titles}>
            <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
              {persona.name}
            </Text>
            <Text style={[styles.status, isTyping && isOnline && styles.typing]} numberOfLines={1}>
              {status}
            </Text>
          </View>
        </Pressable>

        {/* Which kind of chat this is. Simulated and live chats are separate entries on the home screen. */}
        <View style={styles.mode} accessibilityLabel={mode === 'live' ? 'Live chat' : 'Simulated chat'}>
          {mode === 'live' ? <View style={styles.liveDot} /> : null}
          <Text style={styles.modeText}>{mode === 'live' ? 'Live' : 'Simulated'}</Text>
        </View>

        <IconButton onPress={props.onMenuPress} accessibilityLabel="Session options" size={32}>
          <Ellipsis size={16} color={colors.text} strokeWidth={1.75} />
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

function conversationStatus({
  isOnline,
  isTyping,
  chartOwner,
}: Pick<Props, 'isOnline' | 'isTyping' | 'chartOwner'>): string {
  if (!isOnline) {
    return 'Offline';
  }
  if (isTyping) {
    return 'Typing…';
  }
  if (chartOwner) {
    return `Reading ${chartOwner}’s chart`;
  }
  return 'AI astrologer, online';
}

const styles = StyleSheet.create({
  bar: {
    paddingBottom: 10,
    paddingHorizontal: 12,
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
    fontFamily: fonts.semibold,
    fontSize: 15,
    letterSpacing: -0.2,
    color: colors.text,
  },
  status: {
    marginTop: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  typing: {
    color: colors.online,
  },
  mode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  modeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
    backgroundColor: colors.online,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.dangerTint,
  },
  bannerText: {
    flexShrink: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.danger,
  },
});
