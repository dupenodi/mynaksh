import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { DetailButtons, DetailHeading, DetailScroll, DetailWhy, FactList, SectionLabel } from './DetailParts';
import { objectList, text } from '../../lib/read';
import type { DetailProps } from './types';

type Window = { date: string; time?: string; note?: string };

const readWindow = (item: Record<string, unknown>): Window | undefined => {
  const date = text(item, 'date');
  return date ? { date, time: text(item, 'time'), note: text(item, 'note') } : undefined;
};

/** Good dates as a list to choose from; picking one sets a reminder. */
export function MuhuratDetail({ recommendation, look, actions }: DetailProps) {
  const windows = objectList(recommendation.extra, 'dates', readWindow, 5);
  const [picked, setPicked] = useState(0);
  const choice = windows[picked];

  return (
    <DetailScroll>
      <DetailHeading recommendation={recommendation} look={look} />
      <DetailWhy recommendation={recommendation} look={look} />

      {windows.length > 0 ? (
        <>
          <SectionLabel>Auspicious windows</SectionLabel>
          {windows.map((window, index) => {
            const selected = index === picked;
            return (
              <Pressable
                key={`${window.date}-${index}`}
                onPress={() => setPicked(index)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.window, selected && { borderColor: look.tint, backgroundColor: look.wash }]}
              >
                <View style={styles.windowTop}>
                  <Text style={styles.date}>{window.date}</Text>
                  {window.time ? <Text style={[styles.time, { color: look.tint }]}>{window.time}</Text> : null}
                </View>
                {window.note ? <Text style={styles.note}>{window.note}</Text> : null}
              </Pressable>
            );
          })}
        </>
      ) : null}

      <FactList facts={recommendation.facts} />
      <DetailButtons
        primary={choice ? 'Set reminder' : look.cta}
        onPrimary={() =>
          actions.confirm(choice ? `Reminder set: ${choice.date}${choice.time ? `, ${choice.time}` : ''}` : `${look.cta}: ${recommendation.title}`)
        }
        onClose={actions.close}
      />
    </DetailScroll>
  );
}

const styles = StyleSheet.create({
  window: {
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  windowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
  },
  date: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  time: {
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  note: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
});
