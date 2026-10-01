import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { DetailButtons, DetailHeading, DetailHero, DetailScroll, DetailWhy, FactList, SectionLabel } from './DetailParts';
import { textList } from '../../lib/read';
import type { DetailProps } from './types';

/** Remedies and meditations: the steps as a checklist you can tick off while you do them. */
export function StepsDetail({ recommendation, look, actions }: DetailProps) {
  const steps = textList(recommendation.extra, 'steps');
  const [ticked, setTicked] = useState<Set<number>>(new Set());
  const allDone = steps.length > 0 && ticked.size === steps.length;

  const toggle = (index: number) =>
    setTicked((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

  return (
    <DetailScroll>
      <DetailHero recommendation={recommendation} look={look} height={150} />
      <DetailHeading recommendation={recommendation} look={look} />
      <DetailWhy recommendation={recommendation} look={look} />

      {steps.length > 0 ? (
        <>
          <SectionLabel>How to do it</SectionLabel>
          {steps.map((step, index) => {
            const done = ticked.has(index);
            return (
              <Pressable
                key={`${index}-${step}`}
                onPress={() => toggle(index)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: done }}
                style={styles.step}
              >
                <View style={[styles.box, done && { backgroundColor: look.tint, borderColor: look.tint }]}>
                  {done ? <Check size={13} color={colors.onAccent} strokeWidth={2.5} /> : <Text style={styles.number}>{index + 1}</Text>}
                </View>
                <Text style={[styles.stepText, done && styles.stepDone]}>{step}</Text>
              </Pressable>
            );
          })}
        </>
      ) : null}

      <FactList facts={recommendation.facts} />
      <DetailButtons
        primary={allDone ? 'Mark complete' : look.cta}
        onPrimary={() =>
          actions.confirm(allDone ? `${recommendation.title} complete. Well done.` : `Saved to your rituals: ${recommendation.title}`)
        }
        onClose={actions.close}
      />
    </DetailScroll>
  );
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  stepText: {
    flex: 1,
    paddingTop: 2,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  stepDone: {
    color: colors.faint,
    textDecorationLine: 'line-through',
  },
});
