import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, raisedShadow } from '../theme/colors';
import { fonts } from '../theme/typography';

type ChipProps = {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  /** plain: small and quiet. suggestion: a raised button, something to say next. */
  tone?: 'plain' | 'suggestion';
  icon?: ReactNode;
};

export function Chip({ label, onPress, selected = false, tone = 'plain', icon }: ChipProps) {
  const suggestion = tone === 'suggestion';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={onPress ? { selected } : undefined}
      style={({ pressed }) => [
        styles.chip,
        suggestion && styles.suggestion,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      {icon}
      <Text style={[styles.text, suggestion && styles.suggestionText, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
  },
  suggestion: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 0,
    boxShadow: raisedShadow,
  },
  selected: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brandLine,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedText: {
    color: colors.brand,
  },
});
