import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Star } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '../components/Avatar';
import { Button, IconButton } from '../components/Button';
import { FramedImage } from '../components/FramedImage';
import { PAGE_MAX_WIDTH, PROFILE_CTA_CLEARANCE } from '../components/layout';
import { Detail } from '../components/profile/Detail';
import { ReviewItem } from '../components/profile/ReviewItem';
import { Section } from '../components/profile/Section';
import { Stat } from '../components/profile/Stat';
import { ScreenHeader } from '../components/ScreenHeader';
import { getPersona, type Persona } from '../domain/personas';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { displayTracking, fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const CTA_BAR_MIN_PADDING = 14;

export function PersonaProfileScreen({ route, navigation }: Props) {
  const persona = getPersona(route.params.personaId);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScreenHeader bordered>
        <View style={styles.headerInner}>
          <IconButton onPress={navigation.goBack} accessibilityLabel="Back" size={32}>
            <ChevronLeft size={18} color={colors.text} strokeWidth={1.75} />
          </IconButton>
          <Text style={styles.topTitle}>Profile</Text>
        </View>
      </ScreenHeader>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + PROFILE_CTA_CLEARANCE }]}>
        <ProfileHero persona={persona} />
        <ProfileStats stats={persona.stats} />

        <Section title="About">
          <Text style={styles.paragraph}>{persona.bio}</Text>
        </Section>

        <Section title="A sample reply">
          <View style={styles.sample}>
            <Avatar source={persona.avatar} size={28} />
            <Text style={styles.sampleText}>{persona.quote}</Text>
          </View>
        </Section>

        <Section title="Good at">
          <View style={styles.chips}>
            {persona.specialties.map((specialty) => (
              <Text key={specialty} style={styles.chip}>
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

      <ProfileCtaBar
        persona={persona}
        bottomInset={insets.bottom}
        onChat={() => navigation.navigate('Chat', { personaId: persona.id, mode: 'live' })}
      />
    </View>
  );
}

function ProfileHero({ persona }: { persona: Persona }) {
  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <FramedImage source={persona.avatar} aspectRatio={1.25} radius={18} />

      <View style={styles.identity}>
        <Text style={styles.name} accessibilityRole="header">
          {persona.name}
        </Text>
        <Text style={styles.role}>{persona.title}</Text>
        <View style={styles.presence}>
          <View style={styles.onlineDot} />
          <Text style={styles.presenceText}>Online now. Inspired by {persona.inspiredBy}.</Text>
        </View>
      </View>
    </Animated.View>
  );
}

function ProfileStats({ stats }: { stats: Persona['stats'] }) {
  return (
    <View style={styles.stats}>
      <Stat
        value={stats.rating.toFixed(1)}
        label={`${stats.reviews} reviews`}
        icon={<Star size={13} color={colors.text} fill={colors.text} />}
      />
      <View style={styles.statDivider} />
      <Stat value={stats.consultations} label="Consultations" />
      <View style={styles.statDivider} />
      <Stat value={stats.experience} label="Experience" />
    </View>
  );
}

function ProfileCtaBar({
  persona,
  bottomInset,
  onChat,
}: {
  persona: Persona;
  bottomInset: number;
  onChat: () => void;
}) {
  return (
    <View style={[styles.ctaBar, { paddingBottom: Math.max(bottomInset, CTA_BAR_MIN_PADDING) }]}>
      <Button label={`Chat with ${persona.name}`} caption={persona.fee} size="large" onPress={onChat} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topTitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  content: {
    width: '100%',
    maxWidth: PAGE_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  identity: {
    marginTop: 20,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: displayTracking(36),
    color: colors.text,
  },
  role: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.muted,
  },
  presence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.line,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 25,
    color: colors.muted,
  },
  sample: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  sampleText: {
    flexShrink: 1,
    marginTop: 3,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
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
    paddingTop: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.frosted,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  cta: {
    width: '100%',
    maxWidth: PAGE_MAX_WIDTH - 40,
    alignSelf: 'center',
  },
});
