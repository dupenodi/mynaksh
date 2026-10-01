import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cardShadow, colors } from '../../theme/colors';
import { displayTracking, fonts } from '../../theme/typography';

type Props = {
  /** Small label above the title, e.g. "Your chart at a glance". */
  eyebrow: string;
  title?: string;
  children: ReactNode;
};

/** The frame every reading widget sits in, so they read as one family under a message. */
export function WidgetCard({ eyebrow, title, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

/** A short list with a coloured marker, used for strengths, challenges and next steps. */
export function MarkedList({ items, color }: { items: string[]; color: string }) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item} style={styles.item}>
          <View style={[styles.marker, { backgroundColor: color }]} />
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function WidgetSection({ children }: { children: string }) {
  return <Text style={styles.section}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 460,
    marginTop: 12,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
    boxShadow: cardShadow,
  },
  eyebrow: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    color: colors.faint,
  },
  title: {
    marginTop: 4,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: displayTracking(24),
    color: colors.text,
  },
  section: {
    marginTop: 16,
    marginBottom: 6,
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
  },
  list: {
    gap: 6,
  },
  item: {
    flexDirection: 'row',
    gap: 10,
  },
  marker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  itemText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
});
