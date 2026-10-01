import { Sunrise, Sunset } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { WidgetProps } from '../types';
import { WidgetCard } from './WidgetCard';

/** Today's almanac: the five limbs that matter most, the sun's times, and when to act or wait. */
export function PanchangWidget({ widget }: WidgetProps<'panchang'>) {
  const { date, place, tithi, nakshatra, yoga, sunrise, sunset, rahuKaal, goodHours, note } = widget.panchang;
  const limbs = [
    { label: 'Tithi', value: tithi },
    { label: 'Nakshatra', value: nakshatra },
    ...(yoga ? [{ label: 'Yoga', value: yoga }] : []),
  ];

  return (
    <WidgetCard eyebrow={place ? `Panchang · ${place}` : 'Panchang'} title={date}>
      <View style={styles.limbs}>
        {limbs.map((limb) => (
          <View key={limb.label} style={styles.limb}>
            <Text style={styles.label}>{limb.label}</Text>
            <Text style={styles.value}>{limb.value}</Text>
          </View>
        ))}
      </View>

      {sunrise || sunset ? (
        <View style={styles.sun}>
          {sunrise ? (
            <View style={styles.sunItem}>
              <Sunrise size={16} color={colors.muted} strokeWidth={1.75} />
              <Text style={styles.sunText}>{sunrise}</Text>
            </View>
          ) : null}
          {sunset ? (
            <View style={styles.sunItem}>
              <Sunset size={16} color={colors.muted} strokeWidth={1.75} />
              <Text style={styles.sunText}>{sunset}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.windows}>
        {goodHours.map((hours, index) => (
          <View key={`${hours}-${index}`} style={[styles.window, styles.good]}>
            <Text style={[styles.windowLabel, { color: colors.positive }]}>Good hours</Text>
            <Text style={styles.windowTime}>{hours}</Text>
          </View>
        ))}
        {rahuKaal ? (
          <View style={[styles.window, styles.avoid]}>
            <Text style={[styles.windowLabel, { color: colors.danger }]}>Rahu Kaal · avoid</Text>
            <Text style={styles.windowTime}>{rahuKaal}</Text>
          </View>
        ) : null}
      </View>

      {note ? <Text style={styles.note}>{note}</Text> : null}
    </WidgetCard>
  );
}

const styles = StyleSheet.create({
  limbs: {
    flexDirection: 'row',
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  limb: {
    flex: 1,
    padding: 12,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  value: {
    marginTop: 3,
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  sun: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 12,
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sunText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  windows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  window: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  good: {
    backgroundColor: colors.positiveSoft,
  },
  avoid: {
    backgroundColor: colors.dangerTint,
  },
  windowLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
  },
  windowTime: {
    marginTop: 2,
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
  },
  note: {
    marginTop: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
});
