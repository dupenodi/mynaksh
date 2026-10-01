import { StyleSheet, Text, View } from 'react-native';

import type { Fact } from '../../domain/recommendation';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { WidgetProps } from '../types';
import { MarkedList, WidgetCard, WidgetSection } from './WidgetCard';

/** The first reading after the birth details: key placements, then strengths and challenges. */
export function AnalysisWidget({ widget }: WidgetProps<'analysis'>) {
  const { headline, placements, strengths, challenges } = widget.analysis;

  return (
    <WidgetCard eyebrow="Your chart at a glance" title={headline}>
      <PlacementGrid placements={placements} />
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

/** Two-column cells. Not FactList: that is a single stacked column with side-by-side label/value. */
function PlacementGrid({ placements }: { placements: Fact[] }) {
  if (placements.length === 0) {
    return null;
  }
  return (
    <View style={styles.placementGrid}>
      {placements.map((placement, index) => (
        <View key={`${placement.label}-${index}`} style={styles.placement}>
          <Text style={styles.placementLabel}>{placement.label}</Text>
          <Text style={styles.placementValue} numberOfLines={2}>
            {placement.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  placementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  placement: {
    flexGrow: 1,
    flexBasis: '45%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  placementLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  placementValue: {
    marginTop: 3,
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
});
