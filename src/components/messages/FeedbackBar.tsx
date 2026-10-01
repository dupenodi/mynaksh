import { Copy, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableStateCallbackType } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { DISLIKE_REASONS, type DislikeReason, type Feedback } from '../../domain/message';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Chip } from '../Chip';

type Props = {
  feedback: Feedback | undefined;
  /** Only AI replies can be rated; the human astrologer's messages get the other actions. */
  rateable: boolean;
  time: string;
  onCopy: () => void;
  onRate: (rating: Feedback['rating']) => void;
  onToggleReason: (reason: DislikeReason) => void;
};

const ICON = { size: 16, strokeWidth: 1.75 };

/** The row under a reply: copy and rating. Reply is a swipe, the rest is in the long-press menu. */
export function FeedbackBar({ feedback, rateable, time, onCopy, onRate, onToggleReason }: Props) {
  const reasons = feedback?.rating === 'dislike' ? feedback.reasons : null;
  const liked = feedback?.rating === 'like';
  const disliked = feedback?.rating === 'dislike';

  return (
    <View style={styles.bar}>
      <View style={styles.actions}>
        <ActionButton label="Copy" onPress={onCopy}>
          <Copy {...ICON} color={colors.muted} />
        </ActionButton>
        {rateable ? (
          <>
            <ActionButton label="Helpful" selected={liked} tone="positive" onPress={() => onRate('like')}>
              <ThumbsUp {...ICON} color={liked ? colors.positive : colors.muted} fill={liked ? colors.positiveSoft : 'none'} />
            </ActionButton>
            <ActionButton label="Not helpful" selected={disliked} onPress={() => onRate('dislike')}>
              <ThumbsDown
                {...ICON}
                color={disliked ? colors.accent : colors.muted}
                fill={disliked ? colors.accentSoft : 'none'}
              />
            </ActionButton>
          </>
        ) : null}
        <Text style={styles.time}>{time}</Text>
      </View>

      {reasons ? (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.reasons}>
          <Text style={styles.why}>What was off?</Text>
          <View style={styles.chips}>
            {DISLIKE_REASONS.map((reason) => (
              <Chip
                key={reason}
                label={reason}
                selected={reasons.includes(reason)}
                onPress={() => onToggleReason(reason)}
              />
            ))}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

type ActionButtonProps = {
  label: string;
  selected?: boolean;
  tone?: 'accent' | 'positive';
  onPress: () => void;
  children: ReactNode;
};

function ActionButton({ label, selected = false, tone = 'accent', onPress, children }: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      // react-native-web also reports hover, which the native types leave out.
      style={({ pressed, hovered }: PressableStateCallbackType & { hovered?: boolean }) => [
        styles.action,
        (hovered || pressed) && styles.actionActive,
        selected && (tone === 'positive' ? styles.actionPositive : styles.actionSelected),
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    marginTop: 8,
    marginLeft: -7,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  action: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionActive: {
    backgroundColor: colors.surface,
  },
  actionSelected: {
    backgroundColor: colors.accentSoft,
  },
  actionPositive: {
    backgroundColor: colors.positiveSoft,
  },
  time: {
    marginLeft: 8,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.faint,
  },
  reasons: {
    marginTop: 8,
    marginLeft: 7,
  },
  why: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
});
