import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { DISLIKE_REASONS, type DislikeReason, type Feedback } from '../../domain/message';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Chip } from '../Chip';

type Props = {
  feedback: Feedback | undefined;
  onRate: (rating: Feedback['rating']) => void;
  onToggleReason: (reason: DislikeReason) => void;
};

export function FeedbackBar({ feedback, onRate, onToggleReason }: Props) {
  const reasons = feedback?.rating === 'dislike' ? feedback.reasons : null;
  const liked = feedback?.rating === 'like';
  const disliked = feedback?.rating === 'dislike';

  return (
    <View style={styles.bar}>
      <View style={styles.rates}>
        <RateButton label="Helpful" selected={liked} onPress={() => onRate('like')}>
          <ThumbsUp size={15} color={liked ? colors.accent : colors.muted} strokeWidth={1.75} />
        </RateButton>
        <RateButton label="Not helpful" selected={disliked} onPress={() => onRate('dislike')}>
          <ThumbsDown size={15} color={disliked ? colors.accent : colors.muted} strokeWidth={1.75} />
        </RateButton>
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

type RateButtonProps = { label: string; selected: boolean; onPress: () => void; children: ReactNode };

function RateButton({ label, selected, onPress, children }: RateButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.rate, selected && styles.rateSelected, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flex: 1,
  },
  rates: {
    flexDirection: 'row',
    gap: 4,
  },
  rate: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateSelected: {
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.7,
  },
  reasons: {
    marginTop: 6,
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
