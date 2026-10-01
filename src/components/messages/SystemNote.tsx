import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { SYSTEM_GROUP_END } from './spacing';

export function SystemNote({ text }: { text: string }) {
  return (
    <View style={styles.systemRow}>
      <View style={styles.rule} />
      <Text style={styles.systemText}>{text}</Text>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  systemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SYSTEM_GROUP_END,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  systemText: {
    marginHorizontal: 12,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    flexShrink: 1,
  },
});
