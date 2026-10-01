import { ArrowUpRight } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Recommendation } from '../domain/recommendation';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { cardImage, getExperience } from './catalog';

export const CARD_WIDTH = 200;
export const CARD_GAP = 10;

export type RecommendationCardProps = {
  recommendation: Recommendation;
  onPress: (recommendation: Recommendation) => void;
};

/** Artwork in an inset frame on top, the words underneath on white. */
export function RecommendationCard({ recommendation, onPress }: RecommendationCardProps) {
  const look = getExperience(recommendation.type);
  const image = cardImage(recommendation, look);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${look.label}: ${recommendation.title}`}
      onPress={() => onPress(recommendation)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.art, { backgroundColor: look.wash }]}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={[styles.bigGlyph, { color: look.tint }]}>{look.glyph}</Text>
        )}
        <View style={styles.label}>
          <Text style={[styles.labelGlyph, { color: look.tint }]}>{look.glyph}</Text>
          <Text style={styles.labelText}>{look.label}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {recommendation.title}
        </Text>
        {recommendation.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {recommendation.subtitle}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.cta}>{look.cta}</Text>
          <ArrowUpRight size={14} color={colors.faint} strokeWidth={1.75} />
        </View>
      </View>
    </Pressable>
  );
}

/** Same layout; getExperience gives unknown types a neutral look and no artwork. */
export function FallbackCard(props: RecommendationCardProps) {
  return <RecommendationCard {...props} />;
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
    padding: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  art: {
    height: 120,
    borderRadius: 11,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Explicit size: on web an Image without a width takes the file's own width.
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  bigGlyph: {
    fontSize: 40,
  },
  label: {
    position: 'absolute',
    top: 7,
    left: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.frosted,
  },
  labelGlyph: {
    fontSize: 9,
  },
  labelText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.text,
  },
  body: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 6,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: -0.1,
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 10,
  },
  cta: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
  },
});
