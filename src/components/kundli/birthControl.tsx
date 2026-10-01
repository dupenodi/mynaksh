import { useState } from 'react';
import { Platform, StyleSheet, TextInput, type TextStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { displayDate, displayTime, isoFromDisplay, maskDate, maskTime, validTime } from './birthInput';

type ControlProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
};

const webOutline: TextStyle | null =
  Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as unknown as TextStyle) : null;

export function DateControl({ value, onChange, onFocus, onBlur, accessibilityLabel }: ControlProps) {
  const [text, setText] = useState(() => displayDate(value));

  return (
    <TextInput
      value={text}
      onChangeText={(next) => {
        const masked = maskDate(next);
        setText(masked);
        onChange(isoFromDisplay(masked));
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="DD/MM/YYYY"
      placeholderTextColor={colors.faint}
      keyboardType="number-pad"
      inputMode="numeric"
      maxLength={10}
      textContentType="birthdate"
      autoComplete="birthdate-full"
      accessibilityLabel={accessibilityLabel}
      style={[styles.input, webOutline]}
    />
  );
}

export function TimeControl({ value, onChange, onFocus, onBlur, disabled, accessibilityLabel }: ControlProps) {
  const [text, setText] = useState(() => displayTime(value));

  return (
    <TextInput
      value={disabled ? '' : text}
      onChangeText={(next) => {
        const masked = maskTime(next);
        setText(masked);
        onChange(validTime(masked) ?? (masked.length >= 5 ? masked : ''));
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      editable={!disabled}
      placeholder={disabled ? '' : 'HH:MM'}
      placeholderTextColor={colors.faint}
      keyboardType="number-pad"
      inputMode="numeric"
      maxLength={5}
      accessibilityLabel={accessibilityLabel}
      style={[styles.input, webOutline]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
  },
});
