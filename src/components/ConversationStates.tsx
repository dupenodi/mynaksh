import { CloudOff } from 'lucide-react-native';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import type { Persona } from '../domain/personas';
import { colors } from '../theme/colors';
import { fonts, displayTracking } from '../theme/typography';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Chip } from './Chip';
import { AVATAR_GAP, AVATAR_SIZE, CONTENT_MAX_WIDTH, SCREEN_GUTTER } from './layout';

export function LoadingSkeleton() {
  const pulse = useSharedValue(0.45);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [pulse]);

  const style = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View style={[styles.skeleton, style]} accessibilityLabel="Loading conversation" accessibilityRole="progressbar">
      <View style={[styles.bone, styles.pill]} />
      <View style={[styles.bone, styles.right, { width: '62%' }]} />
      <View style={styles.advisor}>
        <View style={[styles.bone, styles.avatar]} />
        <View style={styles.grow}>
          <View style={[styles.bone, { width: '84%', height: 72 }]} />
          <View style={styles.cards}>
            <View style={[styles.bone, styles.card]} />
            <View style={[styles.bone, styles.card]} />
          </View>
        </View>
      </View>
      <View style={[styles.bone, styles.right, { width: '48%' }]} />
    </Animated.View>
  );
}

export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.center}>
      <View style={styles.errorIcon}>
        <CloudOff size={22} color={colors.text} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>Couldn’t load this conversation</Text>
      <Text style={styles.body}>Check your connection, then try again. Your messages are safe.</Text>
      <Button label="Try again" onPress={onRetry} style={styles.button} />
    </View>
  );
}

type EmptyStateProps = {
  persona: Persona;
  onPick: (text: string) => void;
  onShareKundli: () => void;
};

export function EmptyState({ persona, onPick, onShareKundli }: EmptyStateProps) {
  return (
    <ScrollView contentContainerStyle={styles.emptyScroll} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeInDown.duration(450)} style={styles.empty}>
        <Avatar source={persona.avatar} size={64} />
        <Text style={styles.title}>{persona.name}</Text>
        <Text style={styles.quote}>“{persona.quote}”</Text>
        <Text style={styles.body}>
          Share your birth details so {persona.name} can read your chart, or start with a question.
        </Text>
        <Button label="Share birth details" onPress={onShareKundli} style={styles.button} />
        <View style={styles.suggestions}>
          {persona.suggestions.map((text) => (
            <Chip key={text} label={text} tone="suggestion" onPress={() => onPick(text)} />
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    flex: 1,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH + SCREEN_GUTTER * 2,
    alignSelf: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: 24,
    gap: 20,
  },
  bone: {
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  pill: {
    alignSelf: 'center',
    width: 70,
    height: 14,
  },
  right: {
    alignSelf: 'flex-end',
  },
  advisor: {
    flexDirection: 'row',
  },
  grow: {
    flex: 1,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: AVATAR_GAP,
  },
  cards: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  card: {
    width: 150,
    height: 190,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  title: {
    marginTop: 14,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: displayTracking(26),
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    maxWidth: 340,
    marginTop: 10,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    alignSelf: 'center',
  },
  emptyScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  quote: {
    maxWidth: 360,
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
    textAlign: 'center',
  },
  suggestions: {
    marginTop: 22,
    gap: 10,
    alignItems: 'center',
  },
});
