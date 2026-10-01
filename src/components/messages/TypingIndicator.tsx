import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { Persona } from '../../domain/personas';
import { colors } from '../../theme/colors';
import { Avatar } from '../Avatar';
import { AVATAR_GAP, AVATAR_SIZE } from '../layout';

function Dot({ delay }: { delay: number }) {
  const lift = useSharedValue(0);

  useEffect(() => {
    // Each dot starts a little later than the last, so the three move as a wave.
    lift.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 300 }), withTiming(0, { duration: 300 })), -1),
    );
  }, [delay, lift]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.35 + lift.value * 0.65,
    transform: [{ translateY: -3 * lift.value }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

export function TypingIndicator({ persona }: { persona: Persona }) {
  return (
    <View style={styles.row} accessibilityLabel={`${persona.name} is typing`}>
      <View style={styles.avatar}>
        <Avatar source={persona.avatar} ring={persona.theme.accent} size={AVATAR_SIZE} />
      </View>
      <View style={styles.bubble}>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 22,
  },
  avatar: {
    marginRight: AVATAR_GAP,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 22,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
});
