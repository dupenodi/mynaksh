import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type ChipProps = {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  /** plain: small and quiet. suggestion: larger, brass outline, something to say next. */
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
  },
  suggestion: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: 'rgba(214, 172, 94, 0.4)',
    backgroundColor: 'rgba(214, 172, 94, 0.06)',
  },
  selected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  suggestionText: {
    fontSize: 15,
    color: colors.text,
  },
  selectedText: {
    color: colors.accent,
  },
});
