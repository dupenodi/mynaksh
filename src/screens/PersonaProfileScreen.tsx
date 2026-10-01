import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Star } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArchPortrait } from '../components/ArchPortrait';
import { Avatar } from '../components/Avatar';
import { Button, IconButton } from '../components/Button';
import { personaList, personas, type Review } from '../domain/personas';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const COLUMN = 560;

export function PersonaProfileScreen({ route, navigation }: Props) {
  const persona = personas[route.params.personaId] ?? personaList[0];
  const { theme, stats } = persona;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <LinearGradient colors={[theme.deep, colors.background]} style={styles.glow} />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 130 }]}>
        <IconButton
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Astrologers'))}
          accessibilityLabel="Back"
        >
          <ChevronLeft size={22} color={colors.text} strokeWidth={1.75} />
        </IconButton>

        <Animated.View entering={FadeIn.duration(500)} style={styles.hero}>
          <ArchPortrait source={persona.avatar} aspectRatio={0.8} fadeTo={colors.background} style={styles.portrait} />
          <Text style={styles.name} accessibilityRole="header">
            {persona.name}
          </Text>
          <Text style={[styles.role, { color: theme.accent }]}>{persona.title}</Text>
          <View style={styles.presence}>
            <View style={styles.onlineDot} />
            <Text style={styles.presenceText}>Online now, inspired by {persona.inspiredBy}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(450)} style={styles.stats}>
          <Stat
            value={stats.rating.toFixed(1)}
            label={`${stats.reviews} reviews`}
            icon={<Star size={16} color={colors.accent} fill={colors.accent} />}
          />
          <View style={styles.statDivider} />
          <Stat value={stats.consultations} label="consultations" />
          <View style={styles.statDivider} />
          <Stat value={stats.experience} label="experience" />
        </Animated.View>

        <Section title="About">
          <Text style={styles.paragraph}>{persona.bio}</Text>
        </Section>

        <Section title="A sample reply">
          <View style={styles.sample}>
            <Avatar source={persona.avatar} ring={theme.accent} size={34} />
            <View style={styles.sampleBubble}>
              <Text style={styles.sampleText}>{persona.quote}</Text>
            </View>
          </View>
        </Section>

        <Section title="Good at">
          <View style={styles.chips}>
            {persona.specialties.map((specialty) => (
              <Text key={specialty} style={[styles.chip, { color: theme.accent, backgroundColor: theme.tint }]}>
                {specialty}
              </Text>
            ))}
          </View>
        </Section>

        <Section title="Details">
          <Detail label="Speaks" value={persona.languages.join(', ')} />
          <Detail label="Fee" value={persona.fee} />
          <Detail label="Replies" value={persona.replyTime} last />
        </Section>

        <Section title="Reviews">
          {persona.reviews.map((review, index) => (
            <ReviewItem key={review.author} review={review} last={index === persona.reviews.length - 1} />
          ))}
        </Section>

        <Text style={styles.disclaimer}>
          A parody AI persona inspired by {persona.inspiredBy}, not affiliated with or endorsed by them. Readings are for
          fun and reflection.
        </Text>
      </ScrollView>

      <LinearGradient
        colors={['rgba(14, 18, 34, 0)', colors.background]}
        locations={[0, 0.4]}
        style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Button
          label={`Chat with ${persona.name}`}
          caption={persona.fee}
          onPress={() => navigation.navigate('Chat', { personaId: persona.id })}
          style={styles.cta}
        />
      </LinearGradient>
    </View>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon?: ReactNode }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statTop}>
        {icon}
        <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Detail({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detail, !last && styles.divider]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function ReviewItem({ review, last }: { review: Review; last: boolean }) {
  return (
    <View style={[styles.review, !last && styles.divider]}>
      <View style={styles.reviewStars} accessibilityLabel={`${review.rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={12}
            color={i < review.rating ? colors.accent : colors.faint}
            fill={i < review.rating ? colors.accent : 'transparent'}
          />
        ))}
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
      <Text style={styles.reviewAuthor}>{review.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glow: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    right: 0,
    height: 560,
    opacity: 0.9,
  },
  content: {
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  hero: {
    alignItems: 'center',
    marginTop: 4,
  },
  portrait: {
    width: '72%',
    maxWidth: 300,
  },
  name: {
    marginTop: -18,
    fontFamily: fonts.display,
    fontSize: 46,
    lineHeight: 50,
    color: colors.text,
    textAlign: 'center',
  },
  role: {
    marginTop: 2,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  presence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.online,
  },
  presenceText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
  },
  statLabel: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.line,
  },
  section: {
    marginTop: 36,
  },
  sectionTitle: {
    marginBottom: 12,
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.text,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    color: 'rgba(236, 228, 211, 0.86)',
  },
  sample: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sampleBubble: {
    flexShrink: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    borderTopLeftRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sampleText: {
    fontFamily: fonts.displayItalic,
    fontSize: 20,
    lineHeight: 27,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    overflow: 'hidden',
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  detailLabel: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.muted,
  },
  detailValue: {
    flexShrink: 1,
    marginLeft: 16,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
  },
  review: {
    paddingVertical: 16,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 3,
  },
  reviewText: {
    marginTop: 8,
    fontFamily: fonts.displayItalic,
    fontSize: 19,
    lineHeight: 26,
    color: colors.text,
  },
  reviewAuthor: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  disclaimer: {
    marginTop: 28,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.faint,
    textAlign: 'center',
  },
  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 36,
    paddingHorizontal: 20,
  },
  cta: {
    width: '100%',
    maxWidth: COLUMN - 40,
    alignSelf: 'center',
  },
});
