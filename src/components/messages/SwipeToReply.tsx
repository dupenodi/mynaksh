import { Reply } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { colors } from '../../theme/colors';
import { tapHaptic } from './haptics';

/** How far the message must travel before letting go means "reply". */
const THRESHOLD = 56;
const SPRING = { damping: 22, stiffness: 280 };

type Props = {
  onReply: () => void;
  enabled?: boolean;
  /** The row: spacing around the message. */
  style?: StyleProp<ViewStyle>;
  /** The full-width layer that slides; put alignment here, not on the row. */
  contentStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * Drag a message to the right to reply, as in WhatsApp or Telegram. Past the threshold the
 * arrow fills in and the phone ticks once; releasing there replies, releasing short cancels.
 */
export function SwipeToReply({ onReply, enabled = true, style, contentStyle, children }: Props) {
  const offset = useSharedValue(0);
  const armed = useSharedValue(false);

  const pan = Gesture.Pan()
    .enabled(enabled)
    // Only a clear rightward drag claims the touch; vertical movement stays with the list.
    .activeOffsetX(14)
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      const dx = Math.max(0, event.translationX);
      // Resist past the threshold so the message never runs away from the finger.
      offset.value = dx < THRESHOLD ? dx : THRESHOLD + (dx - THRESHOLD) * 0.2;
      const past = offset.value >= THRESHOLD;
      if (past !== armed.value) {
        armed.value = past;
        if (past) {
          scheduleOnRN(tapHaptic);
        }
      }
    })
    .onFinalize(() => {
      if (armed.value) {
        scheduleOnRN(onReply);
      }
      armed.value = false;
      offset.value = withSpring(0, SPRING);
    });

  const slideStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  const iconStyle = useAnimatedStyle(() => {
    const progress = interpolate(offset.value, [16, THRESHOLD], [0, 1], Extrapolation.CLAMP);
    return {
      opacity: progress,
      transform: [{ scale: 0.6 + progress * 0.4 }],
      backgroundColor: offset.value >= THRESHOLD ? colors.brand : colors.surfaceRaised,
    };
  });

  const glyphStyle = useAnimatedStyle(() => ({ opacity: offset.value >= THRESHOLD ? 0 : 1 }));
  const armedGlyphStyle = useAnimatedStyle(() => ({ opacity: offset.value >= THRESHOLD ? 1 : 0 }));

  return (
    // touchAction is web-only: the default (none) would stop the page scrolling when a drag starts on a message.
    <GestureDetector gesture={pan} touchAction="pan-y">
      <View style={style}>
        <Animated.View style={[styles.icon, iconStyle]}>
          <Animated.View style={[styles.glyph, glyphStyle]}>
            <Reply size={16} color={colors.muted} strokeWidth={2} />
          </Animated.View>
          <Animated.View style={[styles.glyph, armedGlyphStyle]}>
            <Reply size={16} color={colors.onAccent} strokeWidth={2} />
          </Animated.View>
        </Animated.View>
        <Animated.View style={[contentStyle, slideStyle]}>{children}</Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    pointerEvents: 'none',
    left: 4,
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    position: 'absolute',
  },
});
