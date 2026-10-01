import type { ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Button } from '../../components/Button';
import type { Fact, Recommendation } from '../../domain/recommendation';
import { colors } from '../../theme/colors';
import { displayTracking, fonts } from '../../theme/typography';
import { cardImage, type ResolvedExperience } from '../catalog';

// Shared detail-sheet pieces so every type reads as one family.

export function DetailScroll({ children }: { children: ReactNode }) {
  const { height } = useWindowDimensions();
  return (
    <ScrollView style={{ maxHeight: height * 0.78 }} showsVerticalScrollIndicator={false} bounces={false}>
      {children}
    </ScrollView>
  );
}

export function DetailHero({ recommendation, look, height = 190 }: { recommendation: Recommendation; look: ResolvedExperience; height?: number }) {
  const image = cardImage(recommendation, look);
  return (
    <View style={styles.frame}>
      <View style={[styles.hero, { height, backgroundColor: look.wash }]}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={[styles.heroGlyph, { color: look.tint }]}>{look.glyph}</Text>
        )}
      </View>
    </View>
  );
}

export function DetailHeading({ recommendation, look }: { recommendation: Recommendation; look: ResolvedExperience }) {
  return (
    <>
      <Text style={styles.kind}>
        <Text style={{ color: look.tint }}>{look.glyph}</Text>
        {'  '}
        {look.group ? `${look.group.label} · ` : ''}
        {look.label}
      </Text>
      <Text style={styles.title}>{recommendation.title}</Text>
      {recommendation.subtitle ? <Text style={styles.subtitle}>{recommendation.subtitle}</Text> : null}
    </>
  );
}

/** Prefer the astrologer's reason; the type's blurb is the fallback when there is none. */
export function DetailWhy({ recommendation, look }: { recommendation: Recommendation; look: ResolvedExperience }) {
  return <Text style={styles.why}>{recommendation.why ?? look.blurb}</Text>;
}

export function FactList({ facts }: { facts?: Fact[] }) {
  if (!facts?.length) {
    return null;
  }
  return (
    <View style={styles.facts}>
      {facts.map((fact, index) => (
        <View key={`${fact.label}-${index}`} style={[styles.fact, index < facts.length - 1 && styles.factDivider]}>
          <Text style={styles.factLabel}>{fact.label}</Text>
          <Text style={styles.factValue}>{fact.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.section}>{children}</Text>;
}

type DetailButtonsProps = {
  primary: string;
  onPrimary: () => void;
  onClose: () => void;
  disabled?: boolean;
};

export function DetailButtons({ primary, onPrimary, onClose, disabled }: DetailButtonsProps) {
  return (
    <View style={styles.actions}>
      <Button label="Not now" variant="secondary" size="large" onPress={onClose} />
      <Button label={primary} size="large" onPress={onPrimary} disabled={disabled} style={styles.grow} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    padding: 5,
    marginBottom: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
  },
  hero: {
    borderRadius: 13,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // On web an Image without a width takes the file's own width.
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroGlyph: {
    fontSize: 64,
  },
  kind: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  title: {
    marginTop: 6,
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: displayTracking(30),
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.muted,
  },
  why: {
    marginTop: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
    color: colors.muted,
  },
  facts: {
    marginTop: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 11,
  },
  factDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  factLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  factValue: {
    flexShrink: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  section: {
    marginTop: 20,
    marginBottom: 8,
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.muted,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  grow: {
    flex: 1,
  },
});
