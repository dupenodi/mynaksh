import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { Recommendation } from '../../domain/recommendation';
import { getAppearance } from '../../recommendations/appearance';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Button } from '../Button';
import { Sheet } from '../Sheet';

type Props = {
  recommendation: Recommendation | null;
  onClose: () => void;
  onConfirm: (recommendation: Recommendation) => void;
};

export function RecommendationSheet({ recommendation, onClose, onConfirm }: Props) {
  const look = recommendation ? getAppearance(recommendation.type) : null;

  return (
    <Sheet visible={recommendation !== null} onClose={onClose}>
      {recommendation && look ? (
        <>
          <View style={[styles.hero, { backgroundColor: look.wash }]}>
            {look.image ? (
              <Image source={look.image} style={styles.image} resizeMode="cover" />
            ) : (
              <Text style={[styles.heroGlyph, { color: look.tint }]}>{look.glyph}</Text>
            )}
            <LinearGradient
              colors={['rgba(21, 26, 46, 0)', colors.surface]}
              locations={[0.45, 1]}
              style={styles.overlay}
            />
          </View>

          <View style={styles.text}>
            <Text style={[styles.kind, { color: look.tint }]}>
              {look.glyph}  {look.label}
            </Text>
            <Text style={styles.title}>{recommendation.title}</Text>
            {recommendation.subtitle ? <Text style={styles.subtitle}>{recommendation.subtitle}</Text> : null}
            <Text style={styles.blurb}>{look.blurb}</Text>
          </View>

          <Button label={look.cta} onPress={() => onConfirm(recommendation)} style={styles.cta} />
          <Button label="Not now" variant="ghost" onPress={onClose} />
        </>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  hero: {
    height: 210,
    marginHorizontal: -20,
    marginTop: -6,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlyph: {
    fontSize: 64,
  },
  text: {
    marginTop: -28,
  },
  kind: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  title: {
    marginTop: 4,
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 36,
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.muted,
  },
  blurb: {
    marginTop: 14,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: 'rgba(236, 228, 211, 0.86)',
  },
  cta: {
    marginTop: 26,
  },
});
