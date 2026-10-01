import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { displayTracking, fonts } from '../../theme/typography';

export function Stat({ value, label, icon }: { value: string; label: string; icon?: ReactNode }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statTop}>
        {icon}
        <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 24,
    letterSpacing: displayTracking(24),
    color: colors.text,
  },
  statLabel: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
});
