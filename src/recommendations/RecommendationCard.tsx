import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Recommendation } from '../domain/recommendation';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { getAppearance } from './appearance';

export type RecommendationCardProps = {
  recommendation: Recommendation;
  onPress: (recommendation: Recommendation) => void;
};

/** Artwork fills the card; the title sits on a dark fade at its foot. */
export function RecommendationCard({ recommendation, onPress }: RecommendationCardProps) {
  const look = getAppearance(recommendation.type);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${look.label}: ${recommendation.title}`}
      onPress={() => onPress(recommendation)}
      style={({ pressed }) => [styles.card, { backgroundColor: look.wash }, pressed && styles.pressed]}
    >
      {look.image ? (
        <Image source={look.image} style={styles.image} resizeMode="cover" />
      ) : (
        <Text style={[styles.bigGlyph, { color: look.tint }]}>{look.glyph}</Text>
      )}
      <LinearGradient
        colors={['rgba(8, 10, 22, 0.3)', 'rgba(8, 10, 22, 0)', 'rgba(8, 10, 22, 0.7)', '#080A16']}
        locations={[0, 0.22, 0.56, 0.74]}
        style={styles.overlay}
      />

      <View style={styles.label}>
        <Text style={[styles.labelGlyph, { color: look.tint }]}>{look.glyph}</Text>
        <Text style={styles.labelText}>{look.label}</Text>
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
        <Text style={[styles.cta, { color: look.tint }]}>{look.cta}</Text>
      </View>
    </Pressable>
  );
}

/** Same layout; getAppearance gives unknown types a neutral look and no artwork. */
export function FallbackCard(props: RecommendationCardProps) {
  return <RecommendationCard {...props} />;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  card: {
    width: 200,
    height: 250,
    marginRight: 12,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.94,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '76%',
  },
  bigGlyph: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    fontSize: 56,
    opacity: 0.6,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    margin: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(8, 10, 22, 0.6)',
  },
  labelGlyph: {
    fontSize: 10,
  },
  labelText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
  },
  body: {
    padding: 14,
    paddingTop: 0,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(236, 228, 211, 0.72)',
  },
  cta: {
    marginTop: 10,
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
});
