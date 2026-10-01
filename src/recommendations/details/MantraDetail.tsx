import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { tapHaptic } from '../../components/messages/haptics';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { DetailButtons, DetailHeading, DetailScroll, DetailWhy, FactList } from './DetailParts';
import { count, text } from '../../lib/read';
import type { DetailProps } from './types';

const DEFAULT_COUNT = 108;

/** The chant in large type and a bead you tap to keep count, like a mala. */
export function MantraDetail({ recommendation, look, actions }: DetailProps) {
  const mantra = text(recommendation.extra, 'mantra');
  const meaning = text(recommendation.extra, 'meaning');
  const target = count(recommendation.extra, 'count') ?? DEFAULT_COUNT;
  const [done, setDone] = useState(0);
  const scale = useSharedValue(1);
  const bead = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const tap = () => {
    tapHaptic();
    scale.value = withSequence(withTiming(0.9, { duration: 70 }), withTiming(1, { duration: 120 }));
    setDone((value) => Math.min(value + 1, target));
  };
  const complete = done >= target;

  return (
    <DetailScroll>
      <DetailHeading recommendation={recommendation} look={look} />
      {mantra ? (
        <View style={[styles.chant, { backgroundColor: look.wash }]}>
          <Text style={[styles.mantra, { color: look.tint }]}>{mantra}</Text>
          {meaning ? <Text style={styles.meaning}>{meaning}</Text> : null}
        </View>
      ) : null}
      <DetailWhy recommendation={recommendation} look={look} />

      <View style={styles.counter}>
        <Pressable onPress={tap} disabled={complete} accessibilityRole="button" accessibilityLabel="Count one chant">
          <Animated.View style={[styles.bead, { borderColor: look.tint }, complete && { backgroundColor: look.tint }, bead]}>
            <Text style={[styles.beadText, { color: complete ? colors.onAccent : look.tint }]}>{complete ? '✓' : done}</Text>
          </Animated.View>
        </Pressable>
        <Text style={styles.progress}>{complete ? `${target} chants. Beautifully done.` : `Tap the bead · ${done} of ${target}`}</Text>
      </View>

      <FactList facts={recommendation.facts} />
      <DetailButtons
        primary={complete ? 'Done' : 'Remind me daily'}
        onPrimary={() => actions.confirm(complete ? `${recommendation.title}: ${target} chants complete` : `Daily reminder set: ${recommendation.title}`)}
        onClose={actions.close}
      />
    </DetailScroll>
  );
}

const styles = StyleSheet.create({
  chant: {
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
  },
  mantra: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
  },
  meaning: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    textAlign: 'center',
  },
  counter: {
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  bead: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beadText: {
    fontFamily: fonts.display,
    fontSize: 30,
  },
  progress: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
});
