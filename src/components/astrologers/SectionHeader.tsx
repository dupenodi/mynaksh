import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export function SectionHeader({ title, caption }: { title: string; caption: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

/** Separates the simulated list from live chats. */
export function LabelledDivider({ label }: { label: string }) {
  return (
    <View style={styles.divider} accessibilityRole="none">
      <View style={styles.rule} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 22,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
  },
  caption: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.faint,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    paddingHorizontal: 16,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.faint,
  },
});
