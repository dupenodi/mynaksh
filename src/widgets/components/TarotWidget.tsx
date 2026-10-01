import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { tapHaptic } from '../../components/messages/haptics';
import type { TarotCard } from '../../domain/readings';
import { findImage } from '../../media/imageSets';
import { tarotCardBack } from '../../media/images';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { WidgetProps } from '../types';
import { WidgetCard } from './WidgetCard';

const FLIP_HALF_MS = 140;
const TAROT_TINT = '#4B2A5A';

/** Three cards face down. Tap each to turn it over; the reading builds underneath as you go. */
export function TarotWidget({ widget }: WidgetProps<'tarot'>) {
  const { question, cards } = widget.spread;
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const reveal = (index: number) => setRevealed((current) => new Set(current).add(index));

  return (
    <WidgetCard eyebrow="Tarot spread" title={question}>
      <View style={styles.row}>
        {cards.map((card, index) => (
          <FlipCard key={`${card.name}-${index}`} card={card} revealed={revealed.has(index)} onReveal={() => reveal(index)} />
        ))}
      </View>
      {revealed.size < cards.length ? (
        <Text style={styles.hint}>Tap a card to turn it over</Text>
      ) : null}
      {cards.map((card, index) =>
        revealed.has(index) ? (
          <View key={`${card.name}-${index}-meaning`} style={styles.reading}>
            <Text style={styles.position}>
              {card.position ? `${card.position} · ` : ''}
              {card.name}
              {card.reversed ? ' (reversed)' : ''}
            </Text>
            <Text style={styles.meaning}>{card.meaning}</Text>
          </View>
        ) : null,
      )}
    </WidgetCard>
  );
}

function FlipCard({ card, revealed, onReveal }: { card: TarotCard; revealed: boolean; onReveal: () => void }) {
  const squish = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scaleX: squish.value }] }));
  const image = findImage('tarot', card.name);

  const flip = () => {
    tapHaptic();
    squish.value = withSequence(withTiming(0, { duration: FLIP_HALF_MS }), withTiming(1, { duration: FLIP_HALF_MS }));
    // Swap faces at the thinnest point of the squish.
    setTimeout(onReveal, FLIP_HALF_MS);
  };

  return (
    <Pressable
      onPress={flip}
      disabled={revealed}
      accessibilityRole="button"
      accessibilityLabel={revealed ? card.name : `Turn over the ${card.position || 'next'} card`}
      style={styles.slot}
    >
      <Animated.View style={[styles.card, style]}>
        {revealed ? (
          <View style={[styles.face, card.reversed && styles.reversed]}>
            {image ? (
              <Image source={image} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.textFace}>
                <Text style={styles.textGlyph}>✦</Text>
                <Text style={styles.textName}>{card.name}</Text>
              </View>
            )}
          </View>
        ) : (
          <Image source={tarotCardBack} style={styles.image} resizeMode="cover" />
        )}
      </Animated.View>
      <Text style={styles.slotLabel} numberOfLines={1}>
        {card.position || ' '}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  card: {
    width: '100%',
    aspectRatio: 0.72,
    borderRadius: 10,
    overflow: 'hidden',
  },
  face: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  reversed: {
    transform: [{ rotate: '180deg' }],
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  textFace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: 10,
  },
  textGlyph: {
    fontSize: 22,
    color: TAROT_TINT,
  },
  textName: {
    fontFamily: fonts.display,
    fontSize: 16,
    textAlign: 'center',
    color: colors.text,
  },
  slotLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  hint: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.faint,
  },
  reading: {
    marginTop: 14,
  },
  position: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  meaning: {
    marginTop: 3,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
});
