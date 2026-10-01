import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export function DaySeparator({ label }: { label: string }) {
  return (
    <View style={styles.dayRow} accessibilityRole="header">
      <Text style={styles.dayText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dayRow: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  dayText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    color: colors.faint,
  },
});
