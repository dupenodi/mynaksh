import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { WidgetProps } from '../types';
import { MarkedList, WidgetCard, WidgetSection } from './WidgetCard';

/** The first reading after the birth details: key placements, then strengths and challenges. */
export function AnalysisWidget({ widget }: WidgetProps<'analysis'>) {
  const { headline, placements, strengths, challenges } = widget.analysis;

  return (
    <WidgetCard eyebrow="Your chart at a glance" title={headline}>
      {placements.length > 0 ? (
        <View style={styles.grid}>
          {placements.map((placement) => (
            <View key={placement.label} style={styles.cell}>
              <Text style={styles.label}>{placement.label}</Text>
              <Text style={styles.value} numberOfLines={2}>
                {placement.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {strengths.length > 0 ? (
        <>
          <WidgetSection>Working for you</WidgetSection>
          <MarkedList items={strengths} color={colors.positive} />
        </>
      ) : null}
      {challenges.length > 0 ? (
        <>
          <WidgetSection>Needs care</WidgetSection>
          <MarkedList items={challenges} color={colors.brand} />
        </>
      ) : null}
    </WidgetCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  cell: {
    flexGrow: 1,
    flexBasis: '45%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  value: {
    marginTop: 3,
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
});
