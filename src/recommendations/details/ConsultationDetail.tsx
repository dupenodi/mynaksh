import { BadgeCheck } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '../../components/Avatar';
import { Chip } from '../../components/Chip';
import { humanAstrologer } from '../../domain/advisors';
import { slotLabel, upcomingSlots } from '../../domain/consultation';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { DetailButtons, DetailHeading, DetailScroll, DetailWhy, FactList, SectionLabel } from './DetailParts';
import { count, text } from '../../lib/read';
import type { DetailProps } from './types';

const DEFAULT_MINUTES = 30;

/** A slot picker. Booking adds a note to the chat and the human astrologer joins. */
export function ConsultationDetail({ recommendation, look, actions }: DetailProps) {
  const minutes = count(recommendation.extra, 'minutes') ?? DEFAULT_MINUTES;
  const focus = text(recommendation.extra, 'focus') ?? recommendation.title;
  const slots = useMemo(() => upcomingSlots(), []);
  const [slot, setSlot] = useState(slots[0]);

  return (
    <DetailScroll>
      <View style={styles.astrologer}>
        <Avatar source={humanAstrologer.image} size={52} ring={colors.humanRing} />
        <View style={styles.astrologerText}>
          <Text style={styles.name}>{humanAstrologer.name}</Text>
          <View style={styles.verified}>
            <BadgeCheck size={13} color={colors.human} strokeWidth={2} />
            <Text style={styles.verifiedText}>Verified · {humanAstrologer.role}</Text>
          </View>
        </View>
      </View>

      <DetailHeading recommendation={recommendation} look={look} />
      <DetailWhy recommendation={recommendation} look={look} />

      <SectionLabel>Choose a time</SectionLabel>
      <View style={styles.slots}>
        {slots.map((time) => (
          <Chip key={time} label={slotLabel(time)} selected={time === slot} onPress={() => setSlot(time)} />
        ))}
      </View>

      <FactList facts={[{ label: 'Duration', value: `${minutes} minutes` }, ...(recommendation.facts ?? [])]} />
      <DetailButtons
        primary={`Book ${slotLabel(slot)}`}
        onPrimary={() => actions.book({ focus, minutes, startsAt: slot })}
        onClose={actions.close}
      />
    </DetailScroll>
  );
}

const styles = StyleSheet.create({
  astrologer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.humanTint,
    borderWidth: 1,
    borderColor: colors.humanLine,
  },
  astrologerText: {
    gap: 3,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.human,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
