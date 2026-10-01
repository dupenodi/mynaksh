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

/**
 * How a consultation works, then a slot picker. Booking adds a note to the chat
 * and the human astrologer joins the conversation.
 */
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

      <SectionLabel>How it works</SectionLabel>
      {[
        `Pick a slot. A ${minutes}-minute call about “${focus}”.`,
        `${humanAstrologer.name.split(' ')[1]} reads this chat and your chart before you talk.`,
        'She joins this chat to say hello, then calls you at the time you chose.',
      ].map((line, index) => (
        <View key={line} style={styles.how}>
          <Text style={[styles.howNumber, { color: look.tint }]}>{index + 1}</Text>
          <Text style={styles.howText}>{line}</Text>
        </View>
      ))}

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
  how: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 5,
  },
  howNumber: {
    width: 14,
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 21,
  },
  howText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
