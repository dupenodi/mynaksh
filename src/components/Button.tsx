import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  /** Small second line under the label, such as a price. */
  caption?: string;
  icon?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  caption,
  icon,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const primary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon}
        <Text
          style={[styles.label, primary ? styles.primaryLabel : styles.quietLabel, disabled && styles.disabledLabel]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      {caption ? <Text style={[styles.caption, primary && styles.primaryCaption]}>{caption}</Text> : null}
    </Pressable>
  );
}

type IconButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
  children: ReactNode;
  size?: number;
  tone?: 'surface' | 'clear' | 'accent';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  onPress,
  accessibilityLabel,
  children,
  size = 40,
  tone = 'surface',
  disabled = false,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.icon,
        { width: size, height: size, borderRadius: size / 2 },
        tone === 'surface' && styles.iconSurface,
        tone === 'accent' && styles.iconAccent,
        pressed && styles.iconPressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
    boxShadow: '0 10px 28px rgba(214, 172, 94, 0.22)',
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  ghost: {
    minHeight: 44,
  },
  disabled: {
    backgroundColor: colors.surfaceRaised,
    boxShadow: 'none',
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    letterSpacing: 0.1,
  },
  primaryLabel: {
    color: colors.onAccent,
  },
  quietLabel: {
    color: colors.text,
  },
  disabledLabel: {
    color: colors.faint,
  },
  caption: {
    marginTop: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  primaryCaption: {
    color: 'rgba(26, 20, 8, 0.66)',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSurface: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
  },
  iconAccent: {
    backgroundColor: colors.accent,
  },
  iconPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
});
