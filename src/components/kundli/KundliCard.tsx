import { StyleSheet, Text, View } from 'react-native';

import { formatBirthDate, sunSign, type Kundli } from '../../domain/kundli';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { KundliChart } from './KundliChart';

/**
 * The attachment as it appears in the chat. The chart is a Surya chart
 * (Sun sign in house 1), which needs only the birth date to draw honestly.
 */
export function KundliCard({ kundli }: { kundli: Kundli }) {
  const sign = sunSign(kundli.dateOfBirth);

  return (
    <View style={styles.card} accessibilityLabel={`Kundli for ${kundli.name}`}>
      <View style={styles.chart}>
        <KundliChart size={84} firstSign={sign?.number ?? null} firstHousePlanets={['Su']} tone="light" />
      </View>
      <View style={styles.details}>
        <Text style={styles.kicker}>Birth chart</Text>
        <Text style={styles.name} numberOfLines={2}>
          {kundli.name}
        </Text>
        {sign ? (
          <Text style={styles.sign}>
            Sun in {sign.name}
          </Text>
        ) : null}
        <Text style={styles.meta}>
          {formatBirthDate(kundli.dateOfBirth)}, {kundli.timeOfBirth ?? 'time unknown'}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {kundli.placeOfBirth}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chart: {
    padding: 2,
  },
  details: {
    flexShrink: 1,
  },
  kicker: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  name: {
    marginTop: 2,
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.1,
    color: colors.text,
  },
  sign: {
    marginTop: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
  },
  meta: {
    marginTop: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
});
