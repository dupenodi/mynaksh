import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArchPortrait } from '../components/ArchPortrait';
import { Button } from '../components/Button';
import { personaList, type Persona } from '../domain/personas';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Astrologers'>;

// Portrait cards read best at book-page width, even on a desktop browser.
const COLUMN = 480;

export function AstrologersScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#1B2141', colors.background]} style={styles.glow} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 40 }]}
      >
        <Text style={styles.wordmark}>MyNaksh</Text>
        <Text style={styles.title} accessibilityRole="header">
          Choose who reads your chart
        </Text>
        <Text style={styles.subtitle}>
          Three AI astrologers, each with a voice of their own. Ask about work, love or the week ahead.
        </Text>

        {personaList.map((persona, index) => (
          <Animated.View key={persona.id} entering={FadeInDown.delay(100 + index * 120).duration(520)}>
            <PersonaCard
              persona={persona}
              onOpenProfile={() => navigation.navigate('Profile', { personaId: persona.id })}
              onChat={() => navigation.navigate('Chat', { personaId: persona.id })}
            />
          </Animated.View>
        ))}

        <Text style={styles.disclaimer}>
          Parody AI personas made for a demo. Not affiliated with or endorsed by Chhota Bheem, Kantara or Sanjay Dutt.
        </Text>
      </ScrollView>
    </View>
  );
}

type CardProps = {
  persona: Persona;
  onOpenProfile: () => void;
  onChat: () => void;
};

function PersonaCard({ persona, onOpenProfile, onChat }: CardProps) {
  const { theme, stats } = persona;
  // An oversized radius would make the browser shrink every corner, so the arch uses exactly half the width.
  const [arch, setArch] = useState(240);

  return (
    <View
      style={[styles.card, { borderTopLeftRadius: arch, borderTopRightRadius: arch }]}
      onLayout={(event) => setArch(event.nativeEvent.layout.width / 2)}
    >
      <Pressable
        onPress={onOpenProfile}
        accessibilityRole="button"
        accessibilityLabel={`${persona.name}, ${persona.title}. Open profile`}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <ArchPortrait source={persona.avatar} aspectRatio={0.96} fadeTo={colors.surface}>
          <View style={styles.nameplate}>
            <Text style={styles.name}>{persona.name}</Text>
            <Text style={[styles.role, { color: theme.accent }]}>{persona.title}</Text>
          </View>
        </ArchPortrait>

        <View style={styles.body}>
          <Text style={styles.tagline}>{persona.tagline}</Text>

          <View style={styles.facts}>
            <View style={styles.fact}>
              <Star size={14} color={colors.accent} fill={colors.accent} />
              <Text style={styles.factStrong}>{stats.rating.toFixed(1)}</Text>
              <Text style={styles.factText}>{stats.reviews} reviews</Text>
            </View>
            <View style={styles.fact}>
              <View style={styles.onlineDot} />
              <Text style={styles.factText}>Online</Text>
            </View>
          </View>

          <View style={styles.specialties}>
            {persona.specialties.slice(0, 3).map((specialty) => (
              <Text key={specialty} style={styles.specialty}>
                {specialty}
              </Text>
            ))}
          </View>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Button
          label={`Chat with ${persona.name}`}
          caption={persona.fee}
          onPress={onChat}
          style={styles.chat}
        />
        <Button label="Profile" variant="secondary" onPress={onOpenProfile} style={styles.profile} />
      </View>
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
    height: 520,
  },
  content: {
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    paddingHorizontal: 20,
    gap: 28,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 0.4,
    color: colors.accent,
  },
  title: {
    marginTop: -12,
    fontFamily: fonts.displayMedium,
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: -0.6,
    color: colors.text,
  },
  subtitle: {
    marginTop: -14,
    marginBottom: 4,
    maxWidth: 380,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pressed: {
    opacity: 0.92,
  },
  nameplate: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 42,
    color: colors.text,
    textAlign: 'center',
  },
  role: {
    marginTop: 2,
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  tagline: {
    maxWidth: 360,
    fontFamily: fonts.displayItalic,
    fontSize: 20,
    lineHeight: 27,
    color: colors.text,
    textAlign: 'center',
  },
  facts: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 16,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  factStrong: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  factText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.online,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  specialty: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    paddingTop: 22,
  },
  chat: {
    flex: 1,
  },
  profile: {
    paddingHorizontal: 20,
  },
  disclaimer: {
    marginTop: 4,
    paddingHorizontal: 12,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.faint,
    textAlign: 'center',
  },
});
